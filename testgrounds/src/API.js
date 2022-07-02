import axios from 'axios';
import { SETTINGS } from '../../settings';
const BASE_URL = 'http://' + SETTINGS.ip + ':5000/';

export function postRequest(type, data) {
    let URL = "";
    let formData = new FormData();
    switch (type) {
        case POSTREQUEST.ADD_USER:
            break;
        case POSTREQUEST.ADD_IMAGE:
            URL += "upload";
            formData.append("tags", data.tags);
            formData.append("dataUri", data.dataUri);
                        
            break;
        case POSTREQUEST.LIKE_DISLIKE:
            break;
    }

    let retData;
    await axios({
        method: "post",
        url: BASE_URL + URL,
        data: formData
    }).then(res => {
        retData = res.data;
    })
    return retData;


}

export async function getRequest(type, data) {
    let URL = "";
    let formData = new FormData();
    switch (type) {
        case GETREQUEST.MULTIPLE_IMAGES:
            console.log("here")
            URL += `query/${ORDER[data.order]}/${data.tags}/${data.pageNumber}`;
            break;
        case GETREQUEST.SINGLE_IMAGE:
            URL = "img/id/" + data.id;
            break;
        case GETREQUEST.FAVORITES:
            URL = "favorites";
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
        retData = res.data;
    })

    return retData;
}



//map of enums
export const POSTREQUEST = {
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