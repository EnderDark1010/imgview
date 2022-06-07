import axios from 'axios';
const BASE_URL = 'http://10.62.108.217:5000/';
export function putRequest(type, data) {
switch(type){
    case PUTREQUEST.ADD_USER:
        break;
    case PUTREQUEST.ADD_IMAGE:
        break;
    case PUTREQUEST.LIKE_DISLIKE:
        break;
}
}

export async  function getRequest(type, data) {
    let URL="";
    let formData = new FormData();
    switch (type) {
        case GETREQUEST.MULTIPLE_IMAGES:
            console.log("here")
            URL += `query/${ORDER[data.order]}/${data.tags}/${data.pageNumber}`;
            break;
        case GETREQUEST.SINGLE_IMAGE:
            URL = "img/id/"+data.id;
            break;
        case GETREQUEST.FAVORITES:
            URL= "favorites";
            //todo
            formData.append('pageNumber', data.pageNumber);
            formData.append('uID', data.userID);
            break;
        case GETREQUEST.VERIFY_USER_EXISTS:
            URL = "user_existence";
            //todo
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
    LIKE_DISLIKE: "LIKE_DISLIKE",
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
    scoreDown: "scoreDown",
    scoreUp: "scoreUp",
    idUp: "idUp",
    idDown: "idDown",
    random: "random",
}