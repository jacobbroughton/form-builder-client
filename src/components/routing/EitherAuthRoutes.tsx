import { Outlet, useLocation } from "react-router-dom";
import FloatingCreateButton from "../../components/ui/FloatingCreateButton/FloatingCreateButton";
import { Navbar } from "../../components/ui/Navbar/Navbar";
import { useContext } from "react";
import { UserContext } from "../../providers/UserContextProvider";
import { ErrorBanner } from "../../components/pages/ErrorBanner/ErrorBanner";
import { ErrorContext } from "../../providers/ErrorContextProvider";

export const EitherAuthRoutes = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { error, setError } = useContext(ErrorContext);

  return (
    <>
      <Navbar authenticated={user !== null} />
      {error && <ErrorBanner message={error.toString()} setError={setError} />}
      <div id="detail">
        <Outlet />
      </div>
      {location.pathname !== "/create-form" && <FloatingCreateButton />}
    </>
  );
};
