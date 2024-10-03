import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import "./ErrorPage.css";

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <main className="error-page">
      <div className="container">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="error-message">
          <i>
            {isRouteErrorResponse(error)
              ? // note that error is type `ErrorResponse`
                error.data || error.statusText || error.toString()
              : "Unknown error message"}
          </i>
        </p>
      </div>
    </main>
  );
};
