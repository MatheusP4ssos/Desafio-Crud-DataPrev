import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Header from "./assets/header/header.jsx";
import Main from "./assets/main/main.jsx";
import ReportButton from "./components/ReportButton";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Header />
    <Main />
    <ReportButton />
  </StrictMode>
);
