import { Link } from "react-router-dom";
import "./GoogleOAuthError.css";

const GoogleOAuthError = () => {
  return (
    <main className="google-oauth-error">
      <div className="container">
        <h1>Oops!</h1>
        <p>Looks like something happened when you were authenticating with Google...</p>
        <p>
          Please try to <Link to="/login">log in</Link> or{" "}
          <Link to="/create-account">sign up</Link> again
        </p>
      </div>
    </main>
  );
};
export default GoogleOAuthError;
