import axios from 'axios';
const BASE_URL = 'http://192.168.1.114:5000/';
export function putRequest(type, data) {

}

export async  function getRequest(type, data) {
    let URL;
    let formData = new FormData();
    switch (type) {
        case GETREQUEST.MULTIPLE_IMAGES:
            URL += "search";
            formData.append('tags', data.tags);
            formData.append('pageNumber', data.pageNumber);
            formData.append('order', ORDER[data.order]);
            break;
        case GETREQUEST.SINGLE_IMAGE:
            URL = "img/id/"+data.id;
            break;
        case GETREQUEST.FAVORITES:
            URL= "favorites";
            formData.append('pageNumber', data.pageNumber);
            formData.append('uID', data.userID);
            break;
        case GETREQUEST.VERIFY_USER_EXISTS:
            URL = "user_existence";
            formData.append('username', data.username);
            formData.append('password', data.password);
            break;
    }
   let retData;
   await axios({
        method: "get",
        url: BASE_URL + URL,
        
    }).then(res => {
        retData= res.data;
    })

    return retData;
}



//map of enums
export const PUTREQUEST = {
    ADJUST_FAVORITE: "ADJUST_SCORE",
    ADD_IMAGE: "ADD_IMAGE",
    ADD_USER: "ADD_USER",
}

export const GETREQUEST = {
    MULTIPLE_IMAGES: "MULTIPLE_IMAGES",
    SINGLE_IMAGE: "SINGLE_IMAGE",
    FAVORITES: "FAVORITES",
    VERIFY_USER_EXISTS: "VERIFY_USER_EXISTS",
}


export const ORDER = {
    SCORE_UP: "ORDER BY score ASC;",
    SCORE_DOWN: "ORDER BY score DESC;",
    AGE_UP: "ORDER BY id ASC;",
    AGE_DOWN: "ORDER BY id DESC",
    RANDOMIZED: "ORDER BY RAND()",
    NONE: ""
}