import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { TicketContext } from "../context/TicketProvider";

const TicketPage = () => {
  const { ticketId } = useParams();
  const { getTicketById } = useContext(TicketContext);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const fetchedTicket = await getTicketById(ticketId);
        setTicket(fetchedTicket);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, getTicketById]);

  if (loading) return <div>Loading...</div>;

  if (!ticket) return <div>No ticket found</div>;

  return (
    <div>
      <h2>Ticket for {ticket.event.title}</h2>
      <p>Event Date: {new Date(ticket.event.date).toLocaleDateString()}</p>
      <p>Venue: {ticket.event.location}</p>
      <p>Purchased at: {new Date(ticket.purchasedAt).toLocaleString()}</p>
      <p>Price: {ticket.price > 0 ? `$${ticket.price}` : "Free"}</p>
      <img src={ticket.barcode} alt="Ticket Barcode" />
    </div>
  );
};

export default TicketPage;
