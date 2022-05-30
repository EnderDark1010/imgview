import fetch from 'node-fetch';
import React from "react";

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      tagsForAll: "asdf"
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

    reader.readAsDataURL(imgRaw);
    reader.onload = function () {
      fetch("http://localhost:5000/test", {
        method: "POST",
        body: JSON.stringify({
          tags: "txt",
          dataUri: reader.result
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(res => {
        console.log(res);
      });
    }
  }

  updateTags(evt) {
    const val = evt.target.value;
    this.setState({
      tagsForAll: val
    });
  }
  changeFile(evt) {
    const val = evt.target.files[0];
    this.setState({
      file: val,
      fileInput: evt.target.value
    });
  }
}
