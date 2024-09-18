import { Link } from "react-router-dom";
import { PlusIcon } from "../icons/PlusIcon";
import "./FloatingCreateButton.css";

const FloatingCreateButton = () => {
  return (
    <Link to='/create-form' className="floating-create-button">
      <PlusIcon />
    </Link>
  );
};
export default FloatingCreateButton;
