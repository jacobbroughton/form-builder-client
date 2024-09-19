import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import FloatingCreateButton from "./components/ui/FloatingCreateButton/FloatingCreateButton";
import { Navbar } from "./components/ui/Navbar/Navbar";

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <div id="detail">
        <Outlet />
      </div>
      {location.pathname !== "/create-form" ? <FloatingCreateButton /> : false}
    </>
  );
}

export default App;
