// Profile.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { EventContext } from "../context/EventProvider";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { userEvents, getUserEvents, deleteEvent, updateEvent } = useContext(EventContext);
  const [eventToEdit, setEventToEdit] = useState(null);

  // Function to capitalize username
  const capitalizeUsername = (username) => {
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  // Fetch user-specific events when the user changes or component mounts
  useEffect(() => {
    if (user) {
      getUserEvents();
    }
  }, [user, getUserEvents]);

  const handleEdit = (event) => {
    setEventToEdit(event);
  };

  const handleDelete = (id) => {
    deleteEvent(id);
  };

  const clearEdit = () => {
    setEventToEdit(null);
  };

  return (
    <div className="profile-container">
      <h1 className="profile-header">Events On The Horizon</h1>
      <h2>{eventToEdit ? "Edit Event Details" : "Create a New Event"}</h2>
      <EventForm eventToEdit={eventToEdit} clearEdit={clearEdit} updateEvent={updateEvent} />
      <div className="event-list-container">
        <h2>{capitalizeUsername(user.username)}'s Event List</h2>
        <EventList
          events={userEvents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          eventToEdit={eventToEdit}
          clearEdit={clearEdit}
          updateEvent={updateEvent}
        />
      </div>
    </div>
  );
};

export default Profile;
