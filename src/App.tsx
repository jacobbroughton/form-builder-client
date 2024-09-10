import { Link, Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/ui/Navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

export default App;
