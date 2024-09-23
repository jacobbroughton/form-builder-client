import { useContext } from "react";
import { UserContext } from "../../providers/UserContextProvider";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../ui/Navbar/Navbar";
import { ErrorContext } from "../../providers/ErrorContextProvider";
import { ErrorBanner } from "../pages/ErrorBanner/ErrorBanner";

export const UnauthenticatedRoutes = () => {
  const { user } = useContext(UserContext);
  const { error, setError } = useContext(ErrorContext);

  return !user ? (
    <>
      <Navbar authenticated={false} />
      {error ? <ErrorBanner message={error.toString()} setError={setError} /> : false}
      <div id="detail">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/dashboard" />
  );
};
