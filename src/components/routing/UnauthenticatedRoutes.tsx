import { useContext } from "react";
import { UserContext } from "../../UserContextProvider";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../ui/Navbar/Navbar";

export const UnauthenticatedRoutes = () => {
  const { user } = useContext(UserContext);

  return !user ? (
    <>
      <Navbar authenticated={false} />
      <div id="detail">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/dashboard" />
  );
};
