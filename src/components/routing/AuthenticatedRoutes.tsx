import { useContext } from "react";
import { UserContext } from "../../UserContextProvider";
import { Navigate, Outlet } from "react-router-dom";

export const AuthenticatedRoutes = () => {
  const { user } = useContext(UserContext);

  return <>{user ? <Outlet /> : <Navigate to="/login" />}</>;
};
