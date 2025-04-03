import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import AdminPanel from "./screens/adminPanal";
import { Provider } from "react-redux";
import { store } from "./Redux-config/store/store";
import LoginPage from "./screens/loginPage/LoginPage";
import ProtectedRoutes from "./ProtectedRoutes";

const route = createBrowserRouter([
  {
    path:'/',
    element:<LoginPage/>
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { index: true, element: <ProtectedRoutes role="admin" component={<AdminPanel/>}/> }, 
      { path: "admin", element: <ProtectedRoutes role="admin" component={<AdminPanel/>}/>},
      { path: "BrandManagement", element: <div>Brand Management </div> },
      { path: "calendar", element: <div>calendar</div> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={route} />
    
  </Provider>
);
