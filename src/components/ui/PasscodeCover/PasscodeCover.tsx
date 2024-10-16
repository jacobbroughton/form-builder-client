import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormContext } from "../../../providers/FormProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { getErrorMessage } from "../../../utils/usefulFunctions";
import "./PasscodeCover.css";

const PasscodeCover = () => {
  const [passkey, setPasskey] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [prevPasskey, setPrevPasskey] = useState<string>("");
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const { formId } = useParams();
  const { setUser } = useContext(UserContext);
  const { setNeedsPasskeyValidation } = useContext(FormContext);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setPrevPasskey(passkey);

      const response = await fetch(
        `http://localhost:3001/api/form/attempt-passkey-access`,
        {
          method: "post",
          body: JSON.stringify({
            passkey,
            formId,
          }),
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status == 401) {
          setUser(null);
          navigate("/login");
        }

        const body = await response.json();
        throw new Error(
          `Error: ${
            body.message ||
            "There was an error attempting to access this form via passkey"
          }`
        );
      }

      const data = await response.json();

      setError("");
      setSuccess(true);

      const interval = setInterval(() => {
        setRedirectCountdown((prev) => (prev -= 1));
      }, 1000);

      setTimeout(() => {
        setNeedsPasskeyValidation(false);
        clearInterval(interval);
      }, 3000);
    } catch (error) {
      const message = getErrorMessage(error);
      setError(message);

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }

  return (
    <div className="passkey-cover">
      <div className="container">
        <h1>This form requires a passkey</h1>
        <p className="small-text">Please enter the passkey below</p>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="..."
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
          />
          <button type="submit" disabled={prevPasskey === passkey}>
            Submit
          </button>
          {error && <p className="small-text red">{error}</p>}
          {success && (
            <p className="small-text green">
              Success, redirecting you in {redirectCountdown} second
              {redirectCountdown > 1}...
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
export default PasscodeCover;
