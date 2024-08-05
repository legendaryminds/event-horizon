const express = require("express");
const attendeeRouter = express.Router();
const Attendee = require("../models/attendee");

// Middleware to protect routes
const { expressjwt } = require("express-jwt");

attendeeRouter.use(
  expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] })
);

// Route to add a new attendee
attendeeRouter.post("/", async (req, res, next) => {
  try {
    req.body.userId = req.auth._id; // Set the userId from the authenticated user
    const newAttendee = new Attendee(req.body); // Create a new attendee with the request body
    const savedAttendee = await newAttendee.save(); // Save the new attendee to the database
    return res.status(201).send(savedAttendee); // Send the saved attendee back to the client
  } catch (error) {
    res.status(500);
    return next(error); // Pass the error to the error handler
  }
});

// Route to get all attendees for a specific event
attendeeRouter.get("/:eventId", async (req, res, next) => {
  try {
    const attendees = await Attendee.find({ eventId: req.params.eventId }); // Find attendees by eventId
    return res.status(200).send(attendees); // Send the attendees back to the client
  } catch (error) {
    res.status(500);
    return next(error); // Pass the error to the error handler
  }
});

// Route to update an attendee
attendeeRouter.put("/:attendeeId", async (req, res, next) => {
  try {
    const updatedAttendee = await Attendee.findOneAndUpdate(
      { _id: req.params.attendeeId, userId: req.auth._id }, // Find the attendee by attendeeId and userId
      req.body, // Update the attendee with the request body
      { new: true } // Return the updated attendee
    );
    return res.status(200).send(updatedAttendee); // Send the updated attendee back to the client
  } catch (error) {
    res.status(500);
    return next(error); // Pass the error to the error handler
  }
});

// Route to delete an attendee
attendeeRouter.delete("/:attendeeId", async (req, res, next) => {
  try {
    const deletedAttendee = await Attendee.findOneAndDelete({
      _id: req.params.attendeeId, // Find the attendee by attendeeId
      userId: req.auth._id, // Ensure the authenticated user is the owner of the attendee record
    });
    return res
      .status(200)
      .send(
        `Attendee with id ${req.params.attendeeId} was successfully deleted.`
      ); // Send a success message back to the client
  } catch (error) {
    res.status(500);
    return next(error); // Pass the error to the error handler
  }
});

module.exports = attendeeRouter;
