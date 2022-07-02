import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import galleryIcon from "./icons/Gallery.png";
import logoutIcon from "./icons/logout.png";
import uploadIcon from "./icons/upload.png";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props);
    return (
      <>
        <Navbar collapseOnSelect expand="sm">
          <Navbar.Brand>
            <Link to="/">
              <img className="logo" src="https://i.imgur.com/yANGsN3.png" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link>
                <Link to="/">
                  <img className="navIcon" src={galleryIcon} />
                  Gallery
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/upload">
                  <img className="navIcon" src={uploadIcon} />
                  Upload
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/" onClick={(e) => this.props.logout()}>
                  <img className="navIcon" src={logoutIcon}/>
                Logout
                </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Outlet />
      </>
    );
  }
}
