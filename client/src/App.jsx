// App.jsx
import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Public from "./pages/Public";
import Auth from "./components/Auth";
import EventPage from "./pages/EventPage";
import TicketPage from "./pages/TicketPage";
import MyTickets from "./pages/MyTickets"; // Import MyTickets component
import Home from "./pages/Home"; // Ensure Home component is imported
import { AuthContext } from "./context/AuthProvider";
import TicketProvider from "./context/TicketProvider"; // Import TicketProvider

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={!user ? <Auth /> : <Home />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        <Route path="/public" element={user ? <Public /> : <Navigate to="/" />} />
        <Route path="/events/:id" element={<EventPage />} />
        <Route path="/tickets/:ticketId" element={<TicketPage />} />
        <Route path="/my-tickets" element={user ? <MyTickets /> : <Navigate to="/" />} /> {/* Add MyTickets route */}
      </Routes>
    </div>
  );
};

export default App;
