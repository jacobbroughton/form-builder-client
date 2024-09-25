import { useContext } from "react";
import { UserContext } from "../../providers/UserContextProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../ui/Navbar/Navbar";
import { ErrorContext } from "../../providers/ErrorContextProvider";
import { ErrorBanner } from "../pages/ErrorBanner/ErrorBanner";

export const UnauthenticatedRoutes = () => {
  const { user, loading: userLoading } = useContext(UserContext);
  const { error, setError } = useContext(ErrorContext);

  const location = useLocation();

  console.log(location.state?.from?.pathname)

  if (userLoading) return <p>Loading user....</p>

  return !user ? (
    <>
      <Navbar authenticated={false} />
      {error ? <ErrorBanner message={error.toString()} setError={setError} /> : false}
      <div id="detail">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to={location.state?.from?.pathname || "/dashboard"} />
  );
};
