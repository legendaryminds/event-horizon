import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import EventProvider from "./context/EventProvider";
import TicketProvider from "./context/TicketProvider";

// Create a root container using the new API from 'react-dom/client'
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <AuthProvider>
      <EventProvider>
        <TicketProvider>
          <App />
        </TicketProvider>
      </EventProvider>
    </AuthProvider>
  </Router>
);
