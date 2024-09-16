import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-slate-400">
        <i>
          {isRouteErrorResponse(error)
            ? // note that error is type `ErrorResponse`
              error.statusText || error.data
            : "Unknown error message"}
        </i>
      </p>
    </div>
  );
};
