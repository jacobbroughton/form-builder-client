import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <main className="landing">
      <div className="container">
        <div className="hero-banner">
          <h1>Form Builder</h1>
          <h1>A worse alternative to Google Forms</h1>
          <p>Created by Jacob Broughton</p>
          <div className="cta-links">
            <Link to={"/login"}>Login</Link>
            <Link to={"/create-account"}>Sign Up</Link>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Landing;
