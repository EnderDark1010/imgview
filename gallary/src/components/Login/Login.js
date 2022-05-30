import React from 'react';
  
export default class Login extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
      console.log("render login");
      return <div className='center'>
       <div className='paddingTop25'> <input type={"text"} placeholder="username"></input></div>
       <div className='paddingTop25'> <input type={"text"} placeholder="Password"></input></div>
       <div className='paddingTop25'> <button>Login</button></div>
      </div>
      ;
    }
     login(params) {
        this.props.login();
    }

  }

  //