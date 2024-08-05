const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Route for user signup
authRouter.post("/signup", async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      res.status(403);
      return next(new Error("Username is already taken"));
    }
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET);
    return res.status(201).send({ user: savedUser.withoutPassword(), token });
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

// Route for user login
authRouter.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(403);
      return next(new Error("Incorrect Username or Password"));
    }

    const passwordCheck = await user.checkPassword(req.body.password);
    if (!passwordCheck) {
      res.status(403);
      return next(new Error("Incorrect Username or Password"));
    }
    const token = jwt.sign(user.withoutPassword(), process.env.SECRET);
    return res.status(200).send({ user: user.withoutPassword(), token });
  } catch (error) {
    res.status(500);
    return next(error);
  }
});

module.exports = authRouter;
