import React, { useEffect, useContext } from "react";
import { TicketContext } from "../context/TicketProvider";
import { Link } from "react-router-dom";

const MyTickets = () => {
  const { getUserTickets, tickets } = useContext(TicketContext);

  useEffect(() => {
    getUserTickets();
  }, [getUserTickets]);

  if (tickets.length === 0) return <div>No tickets found.</div>;

  return (
    <div className="my-tickets-container">
      <h1 className="my-tickets-header">My Tickets</h1>
      <div className="ticket-list-container">
        <ul className="ticket-list">
          {tickets.map(ticket => (
            <li key={ticket._id} className="ticket-item">
              <p className="ticket-title">Event: {ticket.event.title}</p>
              <p className="ticket-date">Date: {new Date(ticket.event.date).toLocaleDateString()}</p>
              <p className="ticket-location">Venue: {ticket.event.location}</p>
              <p className="ticket-price">Price: {ticket.price > 0 ? `$${ticket.price}` : "Free"}</p>
              <Link to={`/tickets/${ticket._id}`} className="view-ticket-link">View Ticket</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyTickets;
