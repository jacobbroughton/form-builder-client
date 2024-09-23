import { useContext } from "react";
import { UserContext } from "../../UserContextProvider";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../ui/Navbar/Navbar";
import FloatingCreateButton from "../ui/FloatingCreateButton/FloatingCreateButton";

export const AuthenticatedRoutes = () => {
  const { user } = useContext(UserContext);

  console.log(user);

  return user ? (
    <>
      <Navbar authenticated={true}/>
      <div id="detail">
        <Outlet />
      </div>
      {location.pathname !== "/create-form" ? <FloatingCreateButton /> : false}
    </>
  ) : (
    <Navigate to="/login" />
  );
};
