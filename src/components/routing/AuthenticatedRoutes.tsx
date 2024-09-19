import { useContext } from "react";
import { UserContext } from "../../UserContextProvider";
import { Navigate, Outlet } from "react-router-dom";

export const AuthenticatedRoutes = () => {
  const userContext = useContext(UserContext);

  const isAuthenticated = userContext.user?.isAdmin;

  return <>{isAuthenticated ? <Outlet /> : <Navigate to="/login" />}</>;
};
