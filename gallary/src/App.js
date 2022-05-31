import React from "react";
import PageContainer from "./components/Gallary/PageContainer";
import "./css/App.css";
import "./css/Button.css";
import Login from "./components/Login/Login";
import Upload from "./components/Upload/Upload";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
export default class App extends React.Component {
  setIsLoggedIn = this.setIsLoggedIn.bind(this);

  state = { isLoggedIn: false };

  componentDidMount() {
    console.log(this.getLoginDataFromLocalStorage());
    this.setState({ isLoggedIn: false });
  }

  render() {
    if (this.state.isLoggedIn) {
      return (
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<PageContainer />} />
                <Route path="home" element={<PageContainer />} />
                <Route path="Upload" element={<Upload />} />
                <Route path="Login" element={<Login setIsLoggedIn={this.setIsLoggedIn} />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Login setIsLoggedIn={this.setIsLoggedIn} />
        </div>
      );
    }
  }

  getLoginDataFromLocalStorage() {
    return window.localStorage.getItem("isLogedIn");
  }

  setIsLoggedIn(isLoggedIn) {
    this.setState({ isLoggedIn });
    window.localStorage.setItem("isLogedIn", isLoggedIn);
  }
}
