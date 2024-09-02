import { Link, Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <nav>
        <p>Form Builder</p>
        <ul>
          <li>
            <Link to={`/create-form`}>Create Form</Link>
          </li>
        </ul>
      </nav>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

export default App;
