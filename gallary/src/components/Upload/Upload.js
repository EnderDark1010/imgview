import React from "react";
import axios from 'axios';
import SETTINGS from "../../variableSettings";
export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagsForAll: "",
            tagsPerImage: [],
            files: [],
            objectUrls: [],
        };
    }

    render() {
        let i = 0;
        const listItems = this.state.tagsPerImage.map((tags) => {
            return <div>
                <img style={{ height: "200px" }} src={this.state.objectUrls[i]}></img><br/>
                <input id={"id" + i++} className="inputUpload" type={"text"} value={tags} onChange={evt => this.changeValue(evt)}></input>
            </div>
        }

        );
        return (
            <div className='center'>
                <div className='paddingTop25'>
                    <input type={"text"} value={this.state.tagsForAll} placeholder="Tags for all" onChange={evt => this.updateTagsForAll(evt)}></input>
                    <input type={"file"} value={this.state.fileInput} onChange={evt => this.changeFiles(evt)} multiple></input>
                    <button onClick={this.upload.bind(this)}>Upload</button>
                </div>
                <div className="gallery paddingTop25">{listItems}</div>
                
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
        let tagsPerImg = [];
        let objectUrls = [];
        //for files in evenet target
        for (let i = 0; i < evt.target.files.length; i++) {
            tagsPerImg.push("");
            objectUrls.push(URL.createObjectURL(evt.target.files[i]));
        }
        this.setState({
            fileInput: evt.target.value,
            files: evt.target.files,
            tagsPerImage: tagsPerImg,
            objectUrls: objectUrls
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
            const tags = ","+this.state.tagsForAll + "," + this.state.tagsPerImage[i]+",";
            //split tags into array
            const tagsArray = tags.split(",");
            reader.readAsDataURL(imgRaw);
            console.log("upload"+i)
            reader.onload = function () {
                axios({
                    method: "post",
                    url: "http://"+SETTINGS.ip+":5000/upload",
                    data: {
                        tags: tagsArray,
                        dataUri: reader.result
                    }
                })

            }
        }
    }
}
