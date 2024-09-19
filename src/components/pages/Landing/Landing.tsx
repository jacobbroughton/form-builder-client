import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <main className="landing">
      <div className="hero-banner">
        <h1>Form Builder</h1>
        <h3>A worse alternative to Google Forms</h3>
        <p>Created by Jacob Broughton</p>
        <Link to="/login" className="">
          Try it out
        </Link>
      </div>
    </main>
  );
};
export default Landing;
