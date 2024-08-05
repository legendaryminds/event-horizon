const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Attendee schema definition
const attendeeSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event", // Reference to the event
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the user
    required: true,
  },
  name: {
    type: String,
    required: true, // Attendee's name is required
  },
  email: {
    type: String,
    required: true, // Attendee's email is required
  },
  registeredAt: {
    type: Date,
    default: Date.now, // Timestamp for when the attendee registered
  },
});

// Export the Attendee model
module.exports = mongoose.model("Attendee", attendeeSchema);
