import React from "react";
import { Outlet, Link } from "react-router-dom";
import {Navbar,Nav} from "react-bootstrap";
export default class Layout extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props);
    return (<>
      <Navbar collapseOnSelect expand="sm">
        <Navbar.Brand>
          <Link to="/"><img className="logo" src="https://pngroyale.com/wp-content/uploads/2022/02/play-store-utiful-avoid-clutter-your-phone-photo-gallery-.png"/></Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          <Nav.Link>
              <Link to="/">Gallary</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/upload">upload</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/" onClick={(e) => this.props.logout()}>Logout</Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>


       </Navbar>
       <Outlet />
    </>)
  }

}