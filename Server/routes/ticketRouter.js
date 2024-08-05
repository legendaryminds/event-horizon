const express = require("express");
const ticketRouter = express.Router();
const Ticket = require("../models/ticket");
const Event = require("../models/event");
const jsbarcode = require("jsbarcode");
const { createCanvas } = require("canvas");
const { expressjwt } = require("express-jwt");
const { v4: uuidv4 } = require("uuid");

ticketRouter.use(
  expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] })
);

// Route to create a new ticket
ticketRouter.post("/", async (req, res, next) => {
  try {
    const event = await Event.findById(req.body.eventId);
    if (!event) {
      res.status(404).send({ message: "Event not found" });
      return next(new Error("Event not found"));
    }

    req.body.userId = req.auth._id;
    req.body.barcode = uuidv4();
    req.body.price = event.ticketPrice;

    // Create a new ticket instance
    const newTicket = new Ticket(req.body);

    // Generate barcode for the ticket if the event is not free
    if (event.ticketPrice > 0) {
      const canvas = createCanvas();
      jsbarcode(canvas, newTicket.barcode, { format: "CODE128" });
      newTicket.barcode = canvas.toDataURL("image/png");
    }

    // Save the new ticket to the database
    const savedTicket = await newTicket.save();
    return res.status(201).send(savedTicket);
  } catch (error) {
    console.error("Error creating new ticket:", error);
    res.status(500).send({ message: "Failed to create new ticket" });
    return next(error);
  }
});

// Route to get all tickets for a specific event
ticketRouter.get("/event/:eventId", async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ eventId: req.params.eventId });
    return res.status(200).send(tickets);
  } catch (error) {
    console.error("Error fetching tickets for event:", error);
    res.status(500).send({ message: "Failed to fetch tickets for event" });
    return next(error);
  }
});

// Route to get all tickets for the authenticated user
ticketRouter.get("/user", async (req, res, next) => {
  try {
    console.log("Fetching tickets for user ID:", req.auth._id);
    const tickets = await Ticket.find({ userId: req.auth._id });
    if (!tickets.length) {
      console.log("No tickets found for user:", req.auth._id);
      return res.status(200).send([]); // Send empty array when no tickets found
    } else {
      console.log("Tickets found:", tickets);
    }
    return res.status(200).send(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).send({
      message: "Failed to fetch tickets for user",
      error: error.message,
    });
    return next(error);
  }
});

// Route to get a specific ticket by ID
ticketRouter.get("/ticket/:ticketId", async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      res.status(404).send({ message: "Ticket not found" });
      return next(new Error("Ticket not found"));
    }
    return res.status(200).send(ticket);
  } catch (error) {
    console.error("Error fetching ticket by ID:", error);
    res.status(500).send({ message: "Failed to fetch ticket by ID" });
    return next(error);
  }
});

// Route to update a ticket
ticketRouter.put("/:ticketId", async (req, res, next) => {
  try {
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: req.params.ticketId, userId: req.auth._id },
      req.body,
      { new: true }
    );
    return res.status(200).send(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).send({ message: "Failed to update ticket" });
    return next(error);
  }
});

// Route to delete a ticket
ticketRouter.delete("/:ticketId", async (req, res, next) => {
  try {
    const deletedTicket = await Ticket.findOneAndDelete({
      _id: req.params.ticketId,
      userId: req.auth._id,
    });
    return res
      .status(200)
      .send(`Ticket with id ${req.params.ticketId} was successfully deleted.`);
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).send({ message: "Failed to delete ticket" });
    return next(error);
  }
});

module.exports = ticketRouter;
