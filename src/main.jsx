import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { PaymentProvider } from "./context/PaymentContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PaymentProvider>
        <App />
      </PaymentProvider>
    </BrowserRouter>
  </React.StrictMode>
);