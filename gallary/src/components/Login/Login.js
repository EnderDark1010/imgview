import React from 'react';
import fetch from 'node-fetch';
import axios from 'axios';
import { GETREQUEST, getRequest, POSTREQUEST, postRequest } from '../Gallary/API';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  render() {
    return <div className='center'>
      <div className='paddingTop25'> <input type={"text"} value={this.state.username} onChange={evt => this.updateUsername(evt)} placeholder="username"></input></div>
      <div className='paddingTop25'> <input type={"text"} value={this.state.password} onChange={evt => this.updatePassword(evt)} placeholder="password"></input></div>
      <div className='paddingTop25'>
        <button className='marginRight50' onClick={evt => this.logout()}>Logout</button>
        <button className='marginLeft50' onClick={evt => this.login()}>Login</button>
      </div>
      <div className='paddingTop25'>
      <button className='' onClick={evt => this.register()}>Create New User</button>
      </div>
    </div>
      ;
  }
  async login() {
    let data= await getRequest(GETREQUEST.VERIFY_USER_EXISTS, {userName: this.state.username, password: this.state.password});
    console.log(data[0]);
      if(data.length > 0) {
        console.log("login success");
        this.props.setIsLoggedIn(true);
        this.props.setUserID(data[0].id);
      }else{
        console.log("login failed");
      }
  }

  logout() {
    this.props.setIsLoggedIn(false);
    this.props.setUserID(0);
  }

  async register() {
    let data=  await postRequest(POSTREQUEST.ADD_USER, {userName: this.state.username, password: this.state.password});
    console.log(data);
    if(data.data.affectedRows==1) {
      console.log("register success");
      this.props.setIsLoggedIn(true);
      this.props.setUserID(data.data.inertId);
    }else{
      console.log("failed")
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