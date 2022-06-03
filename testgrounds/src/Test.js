import React from "react";
export default class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagsForAll: [],
            fileInput: []
        };
    }

    render() {
        console.log("rerender")
        let i = 0;
        const listItems = this.state.tagsForAll.map((tags) => {
            return <div>
                <input id={"id" + i++} type={"text"} value={tags} onChange={evt => this.changeValue(evt)}></input>
                <img style={{height: "200px"}} src={URL.createObjectURL(this.state.files[i-1])}></img>
            </div>
        }

        );
        return (
            <div className='center'>
                <ul>{listItems}</ul>
                <div className='paddingTop25'>
                    <input type={"file"} value={this.state.fileInput} onChange={evt => this.changeFile(evt)} multiple></input>
                </div>
            </div>
        );
    }

    changeValue(e) {
        //log target event id
        let id = e.target.id;
        console.log(id);
        //remove "id" prefix from id
        id = id.substring(2);
        //id to int
        id = parseInt(id);

        //copy of tagsForAll
        let tagsForAll = this.state.tagsForAll;
        tagsForAll[id] = e.target.value;
        this.setState({
            tagsForAll: tagsForAll
        });
    }

    changeFile(evt) {
        const val = evt.target.files[0];
        console.log(evt.target.files);
        let arr = [];
        //for files in evenet target
        for (let i = 0; i < evt.target.files.length; i++) {
            arr.push("");
        }
        this.setState({
            fileInput: evt.target.value,
            files: evt.target.files,
            tagsForAll: arr
        });
    }

}
