import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "./AuthProvider";

export const EventContext = createContext();

const EventProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const fetchedRef = useRef(false);

  // Custom axios instance for authenticated requests
  const eventAxios = axios.create({
    baseURL: "/api/main",
  });

  eventAxios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Public axios instance for unauthenticated requests
  const publicAxios = axios.create({
    baseURL: "/api/public",
  });

  // Function to get all public events
  const getEvents = useCallback(async () => {
    try {
      const res = await publicAxios.get("/events");
      console.log("Fetched events:", res.data);
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  }, []);

  // Function to get user-specific events
  const getUserEvents = useCallback(async () => {
    if (fetchedRef.current) return; // Check if already fetched to prevent redundant calls
    fetchedRef.current = true;
    try {
      const res = await eventAxios.get("/events/user");
      console.log("Fetched user events:", res.data);
      setUserEvents(res.data);
    } catch (error) {
      console.error("Error fetching user events", error);
    }
  }, [eventAxios, token]);

  // Function to create a new event
  const createEvent = useCallback(async (eventData) => {
    try {
      const res = await eventAxios.post("/events", eventData); 
      console.log("Event created:", res.data);
      setUserEvents((prev) => [...prev, res.data]); 
    } catch (error) {
      console.error("Error creating event", error);
    }
  }, [eventAxios]);

  // Function to update an event
  const updateEvent = useCallback(async (id, updatedEvent) => {
    try {
      const res = await eventAxios.put(`/events/${id}`, updatedEvent);
      setUserEvents(prevEvents => prevEvents.map(event => (event._id === id ? res.data : event)));
      getEvents();
    } catch (error) {
      console.error("Error updating event", error);
    }
  }, [eventAxios, getEvents]);

  // Function to delete an event
  const deleteEvent = useCallback(async (id) => {
    try {
      await eventAxios.delete(`/events/${id}`);
      setUserEvents(prevEvents => prevEvents.filter(event => event._id !== id));
      getEvents(); 
    } catch (error) {
      console.error("Error deleting event", error);
    }
  }, [eventAxios, getEvents]);

  // Fetch public events when the component mounts
  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <EventContext.Provider value={{ events, userEvents, getEvents, getUserEvents, createEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;
