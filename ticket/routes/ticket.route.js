const express = require("express");
const {
  getAllTickets,
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
  updateStatus,
} = require("../controllers/ticket.controller");
const validateTicketBody = require("../middlewares/ticket.middleware");

const router = express.Router();

router.get("/tickets", getAllTickets);

router.get("/tickets/:id", getTicketById);

router.post("/tickets", validateTicketBody, createTicket);

router.put("/tickets/:id", updateTicket);

router.delete("/tickets/:id", deleteTicket);

router.patch("/tickets/:id/resolve", updateStatus);

module.exports = router;
