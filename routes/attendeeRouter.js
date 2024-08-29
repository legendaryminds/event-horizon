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
    req.body.userId = req.auth._id;
    const newAttendee = new Attendee(req.body); 
    const savedAttendee = await newAttendee.save();
    return res.status(201).send(savedAttendee);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Route to get all attendees for a specific event
attendeeRouter.get("/:eventId", async (req, res, next) => {
  try {
    const attendees = await Attendee.find({ eventId: req.params.eventId });
    return res.status(200).send(attendees); 
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Route to update an attendee
attendeeRouter.put("/:attendeeId", async (req, res, next) => {
  try {
    const updatedAttendee = await Attendee.findOneAndUpdate(
      { _id: req.params.attendeeId, userId: req.auth._id }, 
      req.body,
      { new: true }
    );
    return res.status(200).send(updatedAttendee);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Route to delete an attendee
attendeeRouter.delete("/:attendeeId", async (req, res, next) => {
  try {
    const deletedAttendee = await Attendee.findOneAndDelete({
      _id: req.params.attendeeId,
      userId: req.auth._id,
    });
    return res
      .status(200)
      .send(
        `Attendee with id ${req.params.attendeeId} was successfully deleted.`
      ); 
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

module.exports = attendeeRouter;
