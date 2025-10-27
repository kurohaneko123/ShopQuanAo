// src/main.jsx
import { StrictMode } from "react"; 
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ thêm dòng này
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>       {/* ✅ Bọc App trong BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
