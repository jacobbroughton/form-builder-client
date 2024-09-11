import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import CreateForm from "./components/pages/CreateForm/CreateForm.tsx";
import ErrorPage from "./ErrorPage.tsx";
import Forms from "./components/pages/Forms/Forms.tsx";
import Form from "./components/pages/Form/Form.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Forms />,
      },
      {
        path: "/create-form",
        element: <CreateForm />,
      },
      {
        path: "/form/:formId",
        element: <Form />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
