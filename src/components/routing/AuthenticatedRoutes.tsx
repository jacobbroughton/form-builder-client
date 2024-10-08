import { useContext } from "react";
import { UserContext } from "../../providers/UserContextProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../ui/Navbar/Navbar";
import FloatingCreateButton from "../ui/FloatingCreateButton/FloatingCreateButton";
import { ErrorContext } from "../../providers/ErrorContextProvider";
import { ErrorBanner } from "../pages/ErrorBanner/ErrorBanner";
import InitialLoadingSkeleton from "../ui/InitialLoadingSkeleton/InitialLoadingSkeleton";

export const AuthenticatedRoutes = () => {
  const location = useLocation();
  const { user, loading: userLoading } = useContext(UserContext);
  const { error, setError } = useContext(ErrorContext);

  if (userLoading) return <InitialLoadingSkeleton />;

  return user ? (
    <>
      <Navbar authenticated={true} />

      {error && <ErrorBanner message={error.toString()} setError={setError} />}

      <div id="detail">
        <Outlet />
      </div>

      {location.pathname !== "/create-form" && <FloatingCreateButton />}
    </>
  ) : (
    <Navigate to="/login" />
  );
};
