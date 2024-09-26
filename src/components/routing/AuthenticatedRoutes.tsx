import { useContext } from "react";
import { UserContext } from "../../providers/UserContextProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../ui/Navbar/Navbar";
import FloatingCreateButton from "../ui/FloatingCreateButton/FloatingCreateButton";
import { ErrorContext } from "../../providers/ErrorContextProvider";
import { ErrorBanner } from "../pages/ErrorBanner/ErrorBanner";

export const AuthenticatedRoutes = () => {
  const location = useLocation()
  const { user, loading: userLoading } = useContext(UserContext);
  const { error, setError } = useContext(ErrorContext);

  console.log(location.pathname)

  if (userLoading) return <p>User loading....</p>

  return user ? (
    <>
      <Navbar authenticated={true} />
      
      {error ? <ErrorBanner message={error.toString()} setError={setError} /> : false}

      <div id="detail">
        <Outlet />
      </div>
      
      {location.pathname !== "/create-form" ? <FloatingCreateButton /> : false}
    </>
  ) : (
    <Navigate to="/login" />
  );
};
