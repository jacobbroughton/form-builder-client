import { Link } from "react-router-dom";
import GoogleIcon from "../../ui/icons/GoogleIcon";
import "./Login.css";
import { getGoogleOAuthUrl } from "../../../utils/getGoogleOAuthUrl";

const Login = () => {
  return (
    <main className="login">
      <h1>Welcome back</h1>
      <div className="providers-list">
        <Link to={getGoogleOAuthUrl()} className="provider-link">
          <GoogleIcon /> Continue with Google
        </Link>
      </div>
      <p>
        Don't have an account? <Link to={"/create-account"}>Sign Up</Link>
      </p>
    </main>
  );
};
export default Login;
