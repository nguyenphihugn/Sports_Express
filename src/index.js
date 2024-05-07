import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootswatch/dist/cerulean/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./custom.scss";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode>
  <App />
  //</React.StrictMode>
);
