const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Attendee schema definition
const attendeeSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Attendee model
module.exports = mongoose.model("Attendee", attendeeSchema);
