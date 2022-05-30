import React from "react";

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagsForAll: ["1", "2", "3"]
    };
  }

  render() {
    console.log("rerender")
    let i=0;
    const listItems = this.state.tagsForAll.map((number) => {
    return <input id={"id"+i++} type={"text"} value={number} onChange={evt=>this.changeValue(evt)}></input>}
    
  );
    return (
      <div className='center'>
 <ul>{listItems}</ul>
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


}
