import React, { useEffect, useContext } from "react";
import { EventContext } from "../context/EventProvider";
import EventList from "../components/EventList";

const Public = () => {
  const { events, getEvents } = useContext(EventContext);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <div className="public-container">
      <h1 className="public-header">Public Events</h1>
      <div className="event-list-container">
        <EventList events={events} />
      </div>
    </div>
  );
};

export default Public;
