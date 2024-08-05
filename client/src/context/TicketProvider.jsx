import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProvider";

export const TicketContext = createContext();

const ticketAxios = axios.create({
  baseURL: "/api/main",
});

ticketAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const TicketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [ticketsUpdated, setTicketsUpdated] = useState(false);

  const getUserTickets = useCallback(async () => {
    try {
      const res = await ticketAxios.get(`/tickets/user`);
      const fetchedTickets = await Promise.all(res.data.map(async ticket => {
        const eventRes = await ticketAxios.get(`/events/${ticket.eventId}`);
        return { ...ticket, event: eventRes.data };
      }));
      setTickets(fetchedTickets);
      setTicketsUpdated(false); // Reset the flag after fetching tickets
    } catch (error) {
      console.error("Error fetching user tickets", error.response ? error.response.data : error.message);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getUserTickets();
    }
  }, [user, getUserTickets]);

  useEffect(() => {
    if (ticketsUpdated) {
      getUserTickets();
    }
  }, [ticketsUpdated, getUserTickets]);

  const getTicketById = async (ticketId) => {
    try {
      const res = await ticketAxios.get(`/tickets/ticket/${ticketId}`);
      const eventRes = await ticketAxios.get(`/events/${res.data.eventId}`);
      return { ...res.data, event: eventRes.data };
    } catch (error) {
      console.error("Error fetching ticket by ID", error);
      throw error;
    }
  };

  const createTicket = async (ticketData) => {
    try {
      const res = await ticketAxios.post("/tickets", ticketData);
      setTickets(prevTickets => [...prevTickets, res.data]);
      setTicketsUpdated(true); // Set the flag to true when a new ticket is created
    } catch (error) {
      console.error("Error creating ticket", error.response ? error.response.data : error.message);
    }
  };

  return (
    <TicketContext.Provider value={{ tickets, getUserTickets, getTicketById, createTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

export default TicketProvider;
