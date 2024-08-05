const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const { expressjwt } = require("express-jwt");
const path = require("path");

// Initialize Express app
const app = express();

// Use cors middleware
app.use(cors());

// Middleware for parsing JSON and logging HTTP requests
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "Client", "dist")));

// Function to connect to MongoDB
async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
}

// Call the function to connect to the database
connectToDb();

// Routes for authentication (no JWT required)
app.use("/api/auth", require("./routes/authRouter"));

// Public routes (no JWT required)
app.use("/api/public/events", require("./routes/eventRouter").publicRouter);

// Protect all routes under /api/main with JWT
app.use(
  "/api/main",
  expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] })
);

// Protected routes for events, tickets, and attendees
app.use("/api/main/events", require("./routes/eventRouter").protectedRouter);
app.use("/api/main/tickets", require("./routes/ticketRouter"));
app.use("/api/main/attendees", require("./routes/attendeeRouter"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  if (!res.headersSent) {
    if (err.name === "UnauthorizedError") {
      res.status(err.status).send({ errMsg: err.message });
    } else {
      res.status(500).send({ errMsg: err.message });
    }
  } else {
    next(err);
  }
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "Client", "dist", "index.html"))
);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
