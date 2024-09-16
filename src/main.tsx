import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import { CreateForm } from "./components/pages/CreateForm/CreateForm.tsx";
import { Draft } from "./components/pages/Draft/Draft.tsx";
import { EditDraftForm } from "./components/pages/EditDraftForm/EditDraftForm.tsx";
import { EditPublishedForm } from "./components/pages/EditPublishedForm/EditPublishedForm.tsx";
import { Form } from "./components/pages/Form/Form.tsx";
import { Forms } from "./components/pages/Forms/Forms.tsx";
import { ErrorPage } from "./ErrorPage.tsx";
import "./index.css";

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
        path: "/edit-draft-form/:formId",
        element: <EditDraftForm />,
      },
      {
        path: "/edit-published-form/:formId",
        element: <EditPublishedForm />,
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
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
