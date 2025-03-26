import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import AdminPanel from "./screens/adminPanal";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <App /> },
      { path: "admin", element: <AdminPanel/> },
      { path: "inbox", element: <div>inbox</div> },
      { path: "calendar", element: <div>calendar</div> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={route} />
);
