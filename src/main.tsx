import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, Route, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import { CreateForm } from "./components/pages/CreateForm/CreateForm.tsx";
import { Draft } from "./components/pages/Draft/Draft.tsx";
import { EditDraftForm } from "./components/pages/EditDraftForm/EditDraftForm.tsx";
import { EditPublishedForm } from "./components/pages/EditPublishedForm/EditPublishedForm.tsx";
import { Form } from "./components/pages/Form/Form.tsx";
import { Dashboard } from "./components/pages/Dashboard/Dashboard.tsx";
import { ErrorPage } from "./ErrorPage.tsx";
import "./index.css";
import { AuthenticatedRoutes } from "./components/routing/AuthenticatedRoutes";
import Login from "./components/pages/Login/Login.tsx";
import Home from "./components/pages/Home/Home.tsx";
import Landing from "./components/pages/Landing/Landing.tsx";
import UserContextProvider, { UserContext } from "./UserContextProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
    element: <AuthenticatedRoutes />,
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
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </StrictMode>
);
