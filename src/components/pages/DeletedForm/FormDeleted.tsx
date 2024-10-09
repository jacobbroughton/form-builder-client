import { Link } from "react-router-dom";
import "./FormDeleted.css";
import  { ArrowRightIcon }from "../../ui/icons/ArrowRightIcon";

const FormDeleted = () => {
  return (
    <main className="form-deleted">
      <div className="container">
        <h1>This form has been deleted</h1>
        <div className="prompt-section">
          <p>Where to next?</p>
          <div className="links">
            <Link to="/dashboard">
              Home <ArrowRightIcon />
            </Link>
            <Link to="/create-form">
              Create a new form <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
export default FormDeleted;
