import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div>
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
      </div>

      <Outlet />
    </>
  )
};

export default Layout;