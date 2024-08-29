import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EventContext } from "../context/EventProvider";
import TicketForm from "../components/TicketForm";
import { format } from "date-fns";

const EventPage = () => {
  const { id } = useParams();
  const { events, getEvents } = useContext(EventContext);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!events.length) {
      getEvents();
    } else {
      const currentEvent = events.find((event) => event._id === id);
      setEvent(currentEvent);
    }
  }, [id, events, getEvents]);

  useEffect(() => {
    if (!event) {
      const currentEvent = events.find((event) => event._id === id);
      setEvent(currentEvent);
    }
  }, [id, events]);

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>{format(new Date(event.date), 'MM/dd/yyyy')}</p>
      <p>{event.location}</p>
      <p>{event.venue}</p> 
      <p>Ticket Price: {event.ticketPrice > 0 ? `$${event.ticketPrice}` : "Free"}</p>
      <TicketForm />
    </div>
  );
};

export default EventPage;
