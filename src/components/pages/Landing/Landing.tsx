import { Link, useNavigate } from "react-router-dom";
import "./Landing.css";
import { getGoogleOAuthUrl } from "../../../utils/getGoogleOAuthUrl";
import { useContext, useEffect } from "react";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { UserContext } from "../../../UserContextProvider";

const Landing = () => {
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate()


  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch(`http://localhost:3001/api/auth/me`, {
          method: "get",
          credentials: "include",
        });

        if (!response.ok) throw new Error("There was an issue getting user");

        const data = await response.json();

        console.log(data)

        setUser(data);

        console.log("user", data);
      } catch (error) {
        handleCatchError(error);
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user])

  return (
    <main className="landing">
      <div className="hero-banner">
        <h1>Form Builder</h1>
        <h3>A worse alternative to Google Forms</h3>
        <p>Created by Jacob Broughton</p>
        <Link to={getGoogleOAuthUrl()} className="">
          Login with google
        </Link>
      </div>
    </main>
  );
};
export default Landing;
