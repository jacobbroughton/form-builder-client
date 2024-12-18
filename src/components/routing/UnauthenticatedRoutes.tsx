import { useContext } from "react";
import { UserContext } from "../../providers/UserContextProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../ui/Navbar/Navbar";
import { ErrorContext } from "../../providers/ErrorContextProvider";
import { ErrorBanner } from "../pages/ErrorBanner/ErrorBanner";
import {InitialLoadingSkeleton} from "../ui/InitialLoadingSkeleton/InitialLoadingSkeleton";

export function UnauthenticatedRoutes () {
  const { user, loading: userLoading } = useContext(UserContext);
  const { error, setError } = useContext(ErrorContext);

  const location = useLocation();

  if (userLoading) return <InitialLoadingSkeleton />;

  return !user ? (
    <>
      <Navbar authenticated={false} />
      {error && <ErrorBanner message={error.toString()} setError={setError} />}
      <div id="detail">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to={location.state?.from?.pathname || "/dashboard"} />
  );
};
