const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");
const jsbarcode = require("jsbarcode");
const { createCanvas } = require("canvas");

const ticketSchema = new Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true,
  },
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
  price: {
    type: Number,
    required: true,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  barcode: {
    type: String,
    required: true,
  },
});

ticketSchema.pre("save", function (next) {
  if (this.isNew) {
    const canvas = createCanvas();
    jsbarcode(canvas, this.uuid, { format: "CODE128" });
    this.barcode = canvas.toDataURL("image/png");
  }
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
