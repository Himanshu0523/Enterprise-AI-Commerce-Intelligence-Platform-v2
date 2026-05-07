import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ToastProvider } from "./context/ToastContext";
import { ErrorBoundary } from "./component/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ToastProvider>
  </Provider>
);