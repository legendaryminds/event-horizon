import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Public from "./pages/Public";
import Auth from "./components/Auth";
import EventPage from "./pages/EventPage";
import TicketPage from "./pages/TicketPage";
import MyTickets from "./pages/MyTickets"; 
import Home from "./pages/Home"; 
import { AuthContext } from "./context/AuthProvider";
import TicketProvider from "./context/TicketProvider"; 

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
        <Route path="/my-tickets" element={user ? <MyTickets /> : <Navigate to="/" />} /> 
      </Routes>
    </div>
  );
};

export default App;
