import React from "react";
import ReactDOM from "react-dom/client";
import TagInput from "./TagInput";
import "./dev.css";

const rootElement = document.getElementById("root")!;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <TagInput className="taginput" placeholder="Add" autoFocus />
    <em>Use comma or enter to add new tag</em>
  </React.StrictMode>
);
