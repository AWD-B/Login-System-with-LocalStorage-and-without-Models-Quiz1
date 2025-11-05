import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Error from './components/Error';
import './index.css';
import './App.css';
// ...existing code...

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Error>
    <App />
    </Error>
  </React.StrictMode>
);
