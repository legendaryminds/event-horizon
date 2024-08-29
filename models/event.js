const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Event schema definition
const eventSchema = new Schema({
  title: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    required: true, 
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Export the Event model
module.exports = mongoose.model("Event", eventSchema);
