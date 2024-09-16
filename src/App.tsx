import { Outlet } from "react-router-dom";
import { Navbar } from "./components/ui/Navbar/Navbar";
import "./App.css";

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
