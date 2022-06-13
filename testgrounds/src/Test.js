import React from "react";
import axios from 'axios';
export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagsForAll: "",
            tagsPerImage: [],
            files: []
        };
    }

    render() {
        let i = 0;
        const listItems = this.state.tagsPerImage.map((tags) => {
            return <>

                <img style={{ height: "200px" }} src={URL.createObjectURL(this.state.files[i])}></img>
                <input id={"id" + i++} type={"text"} value={tags} onChange={evt => this.changeValue(evt)}></input>
            </>
        }

        );
        return (
            <div className='center'>
                <div className='paddingTop25'>
                    <input type={"text"} value={this.state.tagsForAll} placeholder="Tags" onChange={evt => this.updateTagsForAll(evt)}></input>
                    <input type={"file"} value={this.state.fileInput} onChange={evt => this.changeFiles(evt)} multiple></input>
                </div>
                <button onClick={this.upload.bind(this)}>Upload</button>
                {listItems}
            </div>
        );
    }

    changeValue(e) {
        let id = e.target.id;
        console.log(id);
        id = id.substring(2);
        id = parseInt(id);

        //copy of tagsPerImage
        let tagsPerImage = this.state.tagsPerImage;
        tagsPerImage[id] = e.target.value;
        this.setState({
            tagsPerImage: tagsPerImage
        });
    }

    changeFiles(evt) {
        console.log(evt.target.va);
        let arr = [];
        //for files in evenet target
        for (let i = 0; i < evt.target.files.length; i++) {
            arr.push("");
        }
        this.setState({
            fileInput: evt.target.value,
            files: evt.target.files,
            tagsPerImage: arr
        });
    }
    updateTagsForAll(evt) {
        const val = evt.target.value;
        this.setState({
            tagsForAll: val
        });
    }
    logAll() {
        //log state
        console.log(this.state);
    }
    upload() {
        for (let i = 0; i < this.state.files.length; i++) {

            const reader = new FileReader();
            const imgRaw = this.state.files[i];
            const tags = this.state.tagsForAll + " " + this.state.tagsPerImage[i];
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
    }
}
