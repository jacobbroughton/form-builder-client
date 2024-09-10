import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <Link to={`/`}>Form Builder</Link>
      <ul>
        <li>
          <Link to={`/create-form`}>Create Form</Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navbar;
