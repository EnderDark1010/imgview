import React from "react";
import PageContainer from "./components/Gallery/PageContainer";
import "./css/App.css";
import "./css/Button.css";
import Login from "./components/Login/Login";
import Upload from "./components/Upload/Upload";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { GETREQUEST, getRequest } from "./API";
export default class App extends React.Component {
  directLogin= this.directLogin.bind(this);
  login= this.login.bind(this);
  state = {
    isLoggedIn: false,
    userID: 0
  };

  componentDidMount() {
    console.log("componentDidMount");
    this.tryLoginUsingLocalStorage();
  }

  render() {
    if (this.state.isLoggedIn) {
      return (
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout logout={this.logout.bind(this)}/>}>
                <Route index element={<PageContainer userID={this.state.userID} />} />
                <Route path="home" element={<PageContainer userID={this.state.userID} />} />
                <Route path="Upload" element={<Upload />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Login login={this.login} directLogin={this.directLogin} />
        </div>
      );
    }
  }



  directLogin(userID,isLoggedIn) {
    this.setState({ userID,isLoggedIn });
  }

  tryLoginUsingLocalStorage() {
    console.log(window.localStorage);
    const userName = window.localStorage.getItem("userName");
    const password = window.localStorage.getItem("password");
    this.login(userName, password);
  }
  async login(userName, password) {
    window.localStorage.setItem("userName", userName);
    window.localStorage.setItem("password", password);
    let data = await getRequest(GETREQUEST.VERIFY_USER_EXISTS, { userName, password });
    if (data.length > 0) {
      console.log("login success");
      // this.setIsLoggedIn(true);
      // this.setUserID(data[0].id);
      this.directLogin(data[0].id,true)
      return true;
    } else {
      console.log("login failed");
      return false;
    }
  }

  async logout(){
    window.localStorage.setItem("userName", "");
    window.localStorage.setItem("password", "");
    this.directLogin(0,false)
  }
}