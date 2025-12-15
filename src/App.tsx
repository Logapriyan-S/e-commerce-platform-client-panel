// src/App.tsx
import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
};

export default App;
