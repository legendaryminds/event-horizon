import React, { useState, useContext } from "react";
import { TicketContext } from "../context/TicketProvider";
import { useParams } from "react-router-dom";

const TicketForm = () => {
  const { createTicket } = useContext(TicketContext);
  const { id } = useParams(); 
  const [ticketData, setTicketData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTicket = {
      ...ticketData,
      eventId: id,
    };
    await createTicket(newTicket);
    setTicketData({ name: "", email: "" });
    alert("Ticket created successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={ticketData.name}
        onChange={handleChange}
        placeholder="Your Name"
        required
      />
      <input
        type="email"
        name="email"
        value={ticketData.email}
        onChange={handleChange}
        placeholder="Your Email"
        required
      />
      <button type="submit">Get Ticket</button>
    </form>
  );
};

export default TicketForm;
