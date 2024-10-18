import { Link } from "react-router-dom";
import "./CatchView.css";
import { PlusIcon } from "../icons/PlusIcon";
import { HomeIcon } from "../icons/HomeIcon";

export function CatchView() {
  return (
    <div className="catch-view">
      <div className="heading">
        <h2>Hmm...</h2>
        <p className="small-text bold">
          Not sure where you were trying to go, but it probably isn't here
        </p>
      </div>
      <div className="content">
        <p className="small-text bold">Could it be one of these?</p>
        <div className="links">
          <Link to="/dashboard" className="action-button-with-icon">
            <HomeIcon /> Home
          </Link>
          <Link to="/create-form" className="action-button-with-icon">
            <PlusIcon /> Create a new form
          </Link>
        </div>
      </div>
    </div>
  );
}
