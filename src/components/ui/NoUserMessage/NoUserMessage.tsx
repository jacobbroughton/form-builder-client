import { Link } from "react-router-dom";
import { NoUserIcon } from "../icons/NoUserIcon";
import "./NoUserMessage.css";

export function NoUserMessage({ message }: { message: string }) {
  return (
    <div className="no-user-message">
      <NoUserIcon />
      <p className="small-text bold">
        <Link to="/login">Log in</Link> or <Link to="/create-account">Sign up</Link>{" "}
        {message}
      </p>
    </div>
  );
}
