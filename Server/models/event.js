const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Event schema definition
const eventSchema = new Schema({
  title: {
    type: String,
    required: true, // Title of the event is required
  },
  description: {
    type: String,
    required: true, // Description of the event is required
  },
  date: {
    type: Date,
    required: true, // Date of the event is required
  },
  location: {
    type: String,
    required: true, // Location of the event is required
  },
  venue: {
    type: String,
    required: true, // Venue of the event is required
  },
  ticketPrice: {
    type: Number,
    required: true, // Ticket price is required
  },
  category: {
    type: String,
    required: true, // Category of the event is required
  },
  genre: {
    type: String,
    required: true, // Genre of the event is required
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the user who created the event
    required: true,
  },
});

// Export the Event model
module.exports = mongoose.model("Event", eventSchema);
