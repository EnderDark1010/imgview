import axios from "axios";
import file from "compress.js/src/core/file";
import React from "react";
const api = axios.create({
  baseURL: 'http://localhost:5000',
})

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file:null,
      text:"asdf"
    };
  }

  render() {
    return (
      <div>
        <div>
          <input type={"text"} value={this.state.text}  placeholder="Tags" onChange={evt => this.updateTags(evt)}></input>
          <input type={"file"} value={this.state.file} onChange={evt => this.changeFile(evt)}></input>
          <button onClick={evt=>this.upload()}>Upload</button>
        </div>
      </div>
    );
  }


  upload(){
    let fd = new FormData();
    fd.append("txt",this.state.text);
    fd.append("file",this.state.text);
    api.post("/test",fd,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    //make post request to server with form data
    // axios.post('/test', fd)
  }

  updateTags(evt) {
    const val = evt.target.value;
    this.setState({
      text: val
    });
  }
  changeFile(evt) {
    const val = evt.target.value;
    this.setState({
      file: val
    });
  }
}
