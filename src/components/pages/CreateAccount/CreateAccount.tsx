import { Link } from "react-router-dom";
import GoogleIcon from "../../ui/icons/GoogleIcon";
import "./CreateAccount.css";
import { getGoogleOAuthUrl } from "../../../utils/getGoogleOAuthUrl";

const CreateAccount = () => {
  return (
    <main className="create-account">
      <h1>Create an account</h1>
      <div className="providers-list">
        <Link to={getGoogleOAuthUrl()} className="provider-link">
          <GoogleIcon /> Continue with Google
        </Link>
      </div>
      <p>
        Already have an account? <Link to={"/login"}>Login</Link>
      </p>
    </main>
  );
};
export default CreateAccount;