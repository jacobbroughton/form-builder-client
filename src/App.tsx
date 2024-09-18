import { Outlet } from "react-router-dom";
import { Navbar } from "./components/ui/Navbar/Navbar";
import "./App.css";
import FloatingCreateButton from "./components/ui/FloatingCreateButton/FloatingCreateButton";
import { useLocation } from "react-router-dom";

function App() {

  const location = useLocation()

  return (
    <>
      <Navbar />
      <div id="detail">
        <Outlet />
      </div>
      {location.pathname !== '/create-form' ? <FloatingCreateButton /> : false}
    </>
  );
}

export default App;
