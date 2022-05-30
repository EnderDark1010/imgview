import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul className="ulNav">
          <li className="liNav">
            <Link to="/">Home</Link>
          </li>
          <li className="liNav">
            <Link to="/upload">upload</Link>
          </li>
          <li className="liNav">
            <Link to="/login">login</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;