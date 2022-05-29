import { Button } from 'bootstrap';
import React from 'react';
  
export default class Login extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
      console.log("render login");
      return <div>
        <div>
        <input type={"text"} placeholder="username"></input>
        <input type={"text"} placeholder="Password"></input>
        <button>Login</button>
        </div>
      </div>
      ;
    }
     login(params) {
        this.props.login();
    }

  }

  //