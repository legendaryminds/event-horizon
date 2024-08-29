import React, { useState, useContext, useEffect } from "react";
import { EventContext } from "../context/EventProvider";

// Categories and genres
const categories = {
  Music: ["Alternative", "Classical", "Bluegrass/Country", "Electronic", "Hip Hop", "Jazz", "Pop", "Rock"],
  Art: ["Exhibition", "Fair", "Gallery", "Street Art"],
  Dance: ["Ballet", "Burlesque", "Hip Hop", "Pole", "Salsa"],
  Theater: ["Comedy", "Drama", "Musical", "Vaudeville"],
};

const EventForm = ({ eventToEdit, clearEdit, updateEvent }) => {
  const { createEvent } = useContext(EventContext);

  const initialFormData = {
    title: "",
    description: "",
    date: "",
    location: "",
    venue: "",  
    ticketPrice: "", 
    category: "",
    genre: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title,
        description: eventToEdit.description,
        date: eventToEdit.date.slice(0, 10), 
        location: eventToEdit.location,
        venue: eventToEdit.venue,  
        ticketPrice: eventToEdit.ticketPrice, 
        category: eventToEdit.category,
        genre: eventToEdit.genre,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const adjustedData = {
      ...formData,
      date: new Date(formData.date).toISOString(), // Convert date to UTC
    };

    if (eventToEdit) {
      updateEvent(eventToEdit._id, adjustedData);
      clearEdit();
    } else {
      createEvent(adjustedData);
    }

    setFormData(initialFormData);
  };

  const handleCancel = () => {
    clearEdit();
    setFormData(initialFormData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Event Title"
        required
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Event Description"
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Event Location"
        required
      />
      <input
        type="text"
        name="venue"
        value={formData.venue}
        onChange={handleChange}
        placeholder="Event Venue"
        required
      />
      <input
        type="number"
        name="ticketPrice"
        value={formData.ticketPrice}
        onChange={handleChange}
        placeholder="Ticket Price" 
        required
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        {Object.keys(categories).map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <select
        name="genre"
        value={formData.genre}
        onChange={handleChange}
        required
        disabled={!formData.category}
      >
        <option value="">Select Genre</option>
        {formData.category && categories[formData.category].map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>
      <button type="submit">{eventToEdit ? "Update Event" : "Create Event"}</button>
      {eventToEdit && <button type="button" onClick={handleCancel}>Cancel</button>}
    </form>
  );
};

export default EventForm;
