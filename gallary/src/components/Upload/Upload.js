import fetch from 'node-fetch';
import React from "react";
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:5000',
})
export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      tagsForAll: ""
    };
  }

  render() {
    return (
      <div className='center'>
        <div className='paddingTop25'><input type={"text"} value={this.state.tagsForAll} placeholder="Tags" onChange={evt => this.updateTags(evt)}></input></div>
        <div className='paddingTop25'><input type={"file"} value={this.state.fileInput} onChange={evt => this.changeFile(evt)}></input></div>
        <div className='paddingTop25'><button onClick={evt => this.upload()}>Upload</button></div>
      </div>
    );
  }


  async upload() {
    const reader = new FileReader();
    const imgRaw = this.state.file;
    const tags = this.state.tagsForAll;
    reader.readAsDataURL(imgRaw);
    reader.onload = function () {
      axios({
        method: "post",
        url: "http://localhost:5000/test",
        data: {
          tags: tags,
          dataUri: reader.result
        }
      })

    }
  }

  updateTags(evt) {
    const val = evt.target.value;
    this.setState({
      tagsForAll: val
    });
    console.log(val);
  }

  changeFile(evt) {
    const val = evt.target.files[0];
    this.setState({
      file: val,
      fileInput: evt.target.value
    });
  }
}
