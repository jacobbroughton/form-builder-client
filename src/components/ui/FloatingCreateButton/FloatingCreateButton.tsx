import { Link } from "react-router-dom";
import { PlusIcon } from "../icons/PlusIcon";
import "./FloatingCreateButton.css";

export function FloatingCreateButton() {
  return (
    <Link to="/create-form" className="floating-create-button">
      <PlusIcon />
    </Link>
  );
}
