import React from 'react';
import fetch from 'node-fetch';
import axios from 'axios';

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
    </div>
      ;
  }
  login() {
    console.log("login")
    axios({
      method: "post",
      url: "http://localhost:5000/login",
      data: {
        username: this.state.username,
        password: this.state.password
      }
    }).then(res => {
      if(res.data.length > 0) {
        console.log("login success");
        this.props.setIsLoggedIn(true);
      }else{
        console.log("login failed");
      }
    });
  }

  logout() {
    this.props.setIsLoggedIn(false);
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