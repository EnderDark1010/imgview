import React from "react";
import PageContainer from "./components/Gallary/PageContainer";
import "./css/App.css";
import "./css/Button.css";
import Login from "./components/Login/Login";
import Upload from "./components/Upload/Upload";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
export default class App extends React.Component {
  state = { isLoggedIn: false };

  componentDidMount() {
    this.setLoginData();
    console.log(this.getLoginDataFromLocalStorage());
    this.setState({ isLoggedIn: this.getLoginDataFromLocalStorage() });
  }

  render() {
    if (this.state.isLoggedIn) {
      return (
        <div className="App">
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PageContainer />} />
          <Route path="Upload" element={<Upload />} />
          <Route path="Login" element={<Login />} />
        </Route>
      </Routes>
        </BrowserRouter>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Login />
        </div>
      );
    }
  }

  getLoginDataFromLocalStorage() {
    return window.localStorage.getItem("isLogedIn");
  }

  setLoginData() {
    window.localStorage.setItem("isLogedIn", true);
  }
}
