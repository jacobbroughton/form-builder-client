import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import FloatingCreateButton from "./components/ui/FloatingCreateButton/FloatingCreateButton";
import { Navbar } from "./components/ui/Navbar/Navbar";
import { useContext } from "react";
import { UserContext } from "./UserContextProvider";

function App() {
  const location = useLocation();
  const { user } = useContext(UserContext);

  return (
    <>
      <Navbar authenticated={user !== null} />
      <div id="detail">
        <Outlet />
      </div>
      {location.pathname !== "/create-form" ? <FloatingCreateButton /> : false}
    </>
  );
}

export default App;
