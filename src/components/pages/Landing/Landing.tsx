import { Link } from "react-router-dom";
import "./Landing.css";

export function Landing() {
  return (
    <main className="landing">
      <div className="container">
        <div className="hero-banner">
          <h1>Form Builder</h1>
          <h2>A worse alternative to Google Forms</h2>
          <p>Created by Jacob Broughton</p>
          <div className="cta-links">
            <Link to={"/login"}>Login</Link>
            <Link to={"/create-account"}>Sign Up</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
