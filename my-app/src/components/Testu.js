import React from 'react';
import Compress from 'compress.js';
import axios from 'axios';
import Resizer from "react-image-file-resizer";
import { convertDataURIToBinary } from '../funcs/converter';
const api = axios.create({
  baseURL: 'http://localhost:5000/',
})

//https://axios-http.com/docs/post_example
//https://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload
//try https://github.com/Rinlama/react-howtoseries/blob/imagetobase64Tut/src/App.js

//used to upload an image to the database


//try to upload only the input img
const compress = new Compress();
export default class TestU extends React.Component {

  constructor() {
    super();
    this.resize = this.resize.bind(this);
  }
  state = {
    file: null,
    base64URL: '',
    resizedImg: '',
    tags:'',
  };

  handleUpload(e) {
    const url = ""
    const formData = new FormData();
    const config = {
      header: {
        'Content-Type': 'multipart/form-data'
      },
      auth: {
        username: 'master',
        password: 'master'
      }
    }

    const img = this.dataURIToBlob(this.state.base64URL);
    const imgS = this.dataURIToBlob(this.state.resizedImg);
    formData.append('img', img);
    formData.append('imgsm', imgS)
    /*
          api.post(url,{
            'img':this.state.base64URL.split(',')[1],
            'imgsm':this.state.resizedImg.split(',')[1],
            'prefix':this.state.base64URL.split(',')[0],
            'prefixs':this.state.resizedImg.split(',')[0],
            'tags':this.state.tags
          },config).then(response => {
            console.log('response', response)
          }).catch(error => {
            console.log('error', error)
          })
    */
          api.post('/bin',{
            'bin':''
          },config).then(response => {
            console.log('response', response)
          }).catch(error => {
            console.log('error', error)
          })

  }

  dataURIToBlob = (dataURI) => {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ia], { type: mimeString });
  };

  resize(image) {
    try {
      Resizer.imageFileResizer(
        image,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          this.setState({ resizedImg: uri });
        },
        "base64",
        200,
        200
      );
    } catch (err) {
      console.log(err);
    }
  }

  getBase64 = file => {
    return new Promise(resolve => {
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();
      // Convert the file to base64 text
      reader.readAsDataURL(file);
      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  handleFiles = e => {
    let file = this.state;
    file = e.target.files[0];
    this.getBase64(file)
      .then(result => {
        file["base64"] = result;
        this.setState({
          base64URL: result,
          file
        });
      })
      .catch(err => {
        console.log(err);
      });



    this.resize(e.target.files[0]);

    this.setState({
      file: e.target.files[0]
    });
  };






  render() {
    return <div>
      <input onChange={this.handleFiles} id='imgInput' type="file" name="file" accept="image/*"></input>
      <button onClick={(e) => this.handleUpload(e)}>Upload</button>
    </div>
  }
}