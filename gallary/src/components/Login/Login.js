import React from 'react';
import fetch from 'node-fetch';
import axios from 'axios';
import { GETREQUEST, getRequest, POSTREQUEST, postRequest } from '../../API';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      msgCSS:true,
      infoText:[]
    };
  }

  render() {
    let infoBar = "";
    let msg = this.state.infoText.map((line) => {
      return <div>{line}</div>;
    });
    if (this.state.infoText.length != 0) {
      infoBar = <div className={this.state.msgCSS? "infobar-green" :"infobar-red"}>
        {msg}
        </div>;
    }

    return <div className='center'>
      {infoBar}
      <div className='paddingTop25'> <input type={"text"} value={this.state.username} onChange={evt => this.updateUsername(evt)} placeholder="username"></input></div>
      <div className='paddingTop25'> <input type={"text"} value={this.state.password} onChange={evt => this.updatePassword(evt)} placeholder="password"></input></div>
      <div className='paddingTop25'>
        <button  onClick={evt => this.login()}>Login</button>
      </div>
      <div className='paddingTop25'>
      <button className='' onClick={evt => this.register()}>Create New User</button>
      </div>
    </div>
      ;
  }


  async login(){
    const result = await this.props.login(this.state.username,this.state.password);
    if(!result){
      this.setState({infoText:["There seems to be a problem",
      "possibilities are:" ,
      "- Username already exists",
      "- A field is empty\n"],
    msgCSS:false}) 
    }
  }
  async register() {
    let data=  await postRequest(POSTREQUEST.ADD_USER, {userName: this.state.username, password: this.state.password});
    console.log(data);
    if(data.data.affectedRows==1) {
      
      this.props.directLogin(data.data.insertId,true);
      
    }else{
      this.setState({infoText:["There seems to be a problem",
      "possibilities are:" ,
      "- Username already exists",
      "- A field is empty\n"],
    msgCSS:false}) 
    }
  }

  updateUsername(evt) {
    const val = evt.target.value;
    this.setState({
      username: val
    });
  }
  updatePassword(evt) {
    const val = evt.target.value;
    console.log(val)
    this.setState({
      password: val
    });
  }

}

  //