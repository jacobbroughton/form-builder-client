import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import CreateAccount from "./components/pages/CreateAccount/CreateAccount.tsx";
import { CreateForm } from "./components/pages/CreateForm/CreateForm.tsx";
import { Dashboard } from "./components/pages/Dashboard/Dashboard.tsx";
import { Draft } from "./components/pages/Draft/Draft.tsx";
import { EditDraftForm } from "./components/pages/EditDraftForm/EditDraftForm.tsx";
import { EditPublishedForm } from "./components/pages/EditPublishedForm/EditPublishedForm.tsx";
import { ErrorPage } from "./components/pages/Error/ErrorPage.tsx";
import { Form } from "./components/pages/Form/Form.tsx";
import Landing from "./components/pages/Landing/Landing.tsx";
import Login from "./components/pages/Login/Login.tsx";
import { AuthenticatedRoutes } from "./components/routing/AuthenticatedRoutes";
import { UnauthenticatedRoutes } from "./components/routing/UnauthenticatedRoutes.tsx";
import "./index.css";
import UserContextProvider from "./providers/UserContextProvider.tsx";
import ErrorContextProvider from "./providers/ErrorContextProvider.tsx";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/form/:formId",
        element: <Form />,
      },
      {
        path: "/draft/:formId",
        element: <Draft />,
      },
    ],
  },
  {
    path: "/",
    element: <UnauthenticatedRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/create-account",
        element: <CreateAccount />,
      },
    ],
  },
  {
    element: <AuthenticatedRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/create-form",
        element: <CreateForm />,
      },
      {
        path: "/edit-draft-form/:formId",
        element: <EditDraftForm />,
      },
      {
        path: "/edit-published-form/:formId",
        element: <EditPublishedForm />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorContextProvider>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </ErrorContextProvider>
  </StrictMode>
);
