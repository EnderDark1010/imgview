import axios from "axios";
import SETTINGS from "./variableSettings";
const BASE_URL = "http://"+SETTINGS.ip+":5000/";
//File that contains function to access the API more easily

/**
 * A function to handle post Requests
 * @param {POSTREQUEST} type 
 * @param {{}} data  datacontainer
 * @returns 
 */
export async function postRequest(type, data) {
    let URL ="";
    let formdata;
  switch (type) {
    case POSTREQUEST.ADD_USER:
        URL+="register"
        formdata={
            username: data.userName,
            password: data.password
        }
      break;
    case POSTREQUEST.ADD_IMAGE:
      URL += "upload";
        formdata={
            tags: data.tags,
            dataUri: data.dataUri
        }
      break;
    case POSTREQUEST.LIKE_DISLIKE:
        URL+="like";
        formdata={
            imgID: data.imgId,
            userID: data.userId
        }
      break;
      
  }
  let retData;
  await axios({
    method: "post",
    url: BASE_URL + URL,
    data: formdata
}).then(res => {
    retData= res;
});
return retData;
}

/**
 * A function to handle get Requests
 * @param {GETREQUEST} type 
 * @param {*} data datacontainer
 * @returns 
 */
export async function getRequest(type, data) {
    console.log(data);
  let URL = "";
  switch (type) {
    case GETREQUEST.MULTIPLE_IMAGES:
      URL += `query/${ORDER[data.order]}/${data.tags}/${data.pageNumber}/${data.userid}`;
      break;
    case GETREQUEST.SINGLE_IMAGE:
      URL = "img/id/" + data.id;
      break;
    case GETREQUEST.FAVORITES:
      URL = "favorites";
      URL += `query/${ORDER[data.order]}/${data.tags}/${data.pageNumber}/${data.userid}`;

      break;
      case GETREQUEST.VERIFY_USER_EXISTS:
          URL +=`login/${data.userName}/${data.password}`;
          console.log(URL);
          break;
  }
  let retData;
  await axios({
    method: "get",
    url: BASE_URL + URL,
  }).then((res) => {
    retData = res.data;
  });

  return retData;
}

//map of enums
export const POSTREQUEST = {
  LIKE_DISLIKE: "LIKE_DISLIKE",
  ADD_IMAGE: "ADD_IMAGE",
  ADD_USER: "ADD_USER",
};

export const GETREQUEST = {
  MULTIPLE_IMAGES: "MULTIPLE_IMAGES",
  SINGLE_IMAGE: "SINGLE_IMAGE",
  FAVORITES: "FAVORITES",
  VERIFY_USER_EXISTS: "VERIFY_USER_EXISTS"
};

export const ORDER = {
  scoreDown: "scoreDown",
  scoreUp: "scoreUp",
  idUp: "idUp",
  idDown: "idDown",
  random: "random",
};
