// EventList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import EventForm from "./EventForm"; 

const EventList = ({ events, onEdit, onDelete, eventToEdit, clearEdit, updateEvent }) => {
  const [editEventId, setEditEventId] = useState(null); 

  const handleEditClick = (event) => {
    setEditEventId(event._id);
    onEdit(event);
  };

  const handleCancelEdit = () => {
    setEditEventId(null);
    clearEdit();
  };

  return (
    <div className="event-list">
      <ul>
        {events.map(event => (
          <li key={event._id} className="event-item">
            {editEventId === event._id ? (
              <EventForm
                eventToEdit={eventToEdit}
                clearEdit={handleCancelEdit}
                updateEvent={updateEvent}
              />
            ) : (
              <>
                <Link to={`/events/${event._id}`} className="event-title">{event.title}</Link>
                <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                <p className="event-location">{event.location}</p>
                <p className="event-venue">{event.venue}</p>
                <p className="event-price">{event.ticketPrice === 0 ? "Free" : `$${event.ticketPrice}`}</p>
                {onEdit && <button onClick={() => handleEditClick(event)} className="edit-button">Edit</button>}
                {onDelete && <button onClick={() => onDelete(event._id)} className="delete-button">Delete</button>}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
