const express = require("express");
const Event = require("../models/event");
const { expressjwt } = require("express-jwt");

const publicRouter = express.Router();
const protectedRouter = express.Router();

// Public route to get all events
publicRouter.get("/", async (req, res, next) => {
  try {
    const events = await Event.find();
    return res.status(200).send(events);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Middleware to protect routes
protectedRouter.use(
  expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] })
);

// Route to create a new event
protectedRouter.post("/", async (req, res, next) => {
  try {
    req.body.userId = req.auth._id;
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    return res.status(201).send(savedEvent);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Route to get all events created by the logged-in user
protectedRouter.get("/user", async (req, res, next) => {
  try {
    const events = await Event.find({ userId: req.auth._id });
    return res.status(200).send(events);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Route to get a specific event by ID
protectedRouter.get("/:eventId", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      res.status(404).send("Event not found");
    } else {
      return res.status(200).send(event);
    }
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Route to update an event
protectedRouter.put("/:eventId", async (req, res, next) => {
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: req.params.eventId, userId: req.auth._id },
      req.body,
      { new: true }
    );
    return res.status(200).send(updatedEvent);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Route to delete an event
protectedRouter.delete("/:eventId", async (req, res, next) => {
  try {
    const deletedEvent = await Event.findOneAndDelete({
      _id: req.params.eventId,
      userId: req.auth._id,
    });
    return res
      .status(200)
      .send(`Event with id ${req.params.eventId} was successfully deleted.`);
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

module.exports = {
  publicRouter,
  protectedRouter,
};
