// src/components/Portal.jsx
import { createPortal } from "react-dom";

function Portal({ children }) {
  return typeof document !== "undefined"
    ? createPortal(children, document.body)
    : null;
}

export default Portal;
