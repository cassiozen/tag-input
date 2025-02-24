import React from "react";
import ReactDOM from "react-dom/client";
import TagInput from "./TagInput";
import "./dev.css";

const rootElement = document.getElementById("root")!;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <TagInput className="taginput" />
  </React.StrictMode>
);
