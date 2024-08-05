// Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import "../App.css";

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/public">Public</Link>
      <Link to="/my-tickets">My Tickets</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

export default Navbar;
