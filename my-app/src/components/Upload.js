import React from 'react';
import Compress from 'compress.js';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
})

//https://axios-http.com/docs/post_example
//https://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload

//used to upload an image to the database

const compress = new Compress();
export default class Upload extends React.Component {
  constructor() {
    super();


    this.resize = this.resize.bind(this);
  }

  image;
  resImage;
  prefix;
  render() {

    return <div>
      <input onChange={this.resize} id='imgInput' type="file" accept="image/*"></input>
      <input type="text" placeholder='Tags'></input>
      <button onClick={() => this.upload()}>Upload</button>
    </div>
  }

  resize(event) {

    this.setState({ test: '' });
    this.setState({ test2: '' });

    const files = [...event.target.files];
    compress.compress(files, {
      size: 4, // the max size in MB, defaults to 2MB
      quality: 0.75, // the quality of the image, max is 1,
      maxWidth: 1920, // the max width of the output image, defaults to 1920px
      maxHeight: 1920, // the max height of the output image, defaults to 1920px
      resize: true, // defaults to true, set false if you do not want to resize the image width and height
      rotate: true // Enables rotation, defaults to false
    }).then((data) => {

      this.setImages(files[0], data[0]);
      return data;
    })
  }
  setImages(img, rImg) {
    this.image = img;
    this.resImage = rImg;
    this.prefix = rImg['prefix'];

  }

  upload() {
    const formData = new FormData();
    formData.append('image', this.image);
    console.log(this.image);
    api.post('/',
    {
      //img:text
    });
    /*upload
    Tags
    File
    Resized file
    */
  }
}