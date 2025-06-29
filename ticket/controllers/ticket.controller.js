const express = require("express");
const { readFile, writeFile, addToWrite } = require("../models/ticket.model");

const getAllTickets = (req, res) => {
  let allTickets = readFile();
  if (allTickets.length > 0) {
    res.status(200).json({ msg: "Success", ticketDetails: allTickets });
  } else {
    res.status(404).json({ msg: "Not found" });
  }
};

const getTicketById = (req, res) => {
  let id = req.params.id;
  let list = readFile();
  let matched = list.filter((item) => {
    return item.id == id;
  });

  if (matched.length > 0) {
    res.status(200).json({ msg: "Success", ticketDetails: matched });
  } else {
    res.status(404).json({ msg: "Not found" });
  }
};

const createTicket = (req, res) => {
  let newTicket = req.body;
  let list = readFile();
  let ticketList = list;
  let id = ticketList[ticketList.length - 1].id + 1;
  newTicket = { ...newTicket, id, status: "pending" };
  ticketList.push(newTicket);
  addToWrite(ticketList);
  res.status(201).json({ msg: "SUccess", ticketDetails: ticketList });
};

const updateTicket = (req, res) => {
  let id = req.params.id;
  let list = readFile();
  let index = list.findIndex((items) => {
    return items.id == id;
  });
  if (index == -1) {
    res.status(404).json({ msg: "Not found" });
  } else {
    list[index] = { ...list[index], ...req.body };
    writeFile(list);
    res.status(200).json({ msg: "Success", ticketDetails: list[index] });
  }
};

const deleteTicket = (req, res) => {
  let id = req.params.id;
  let list = readFile();
  let index = list.findIndex((items) => {
    return items.id == id;
  });

  if (index == -1) {
    res.status(404).json({ msg: "Not found" });
  } else {
    list.splice(index, 1);
    writeFile(list);
    res.status(200).json({ msg: "Success", ticketDetails: list });
  }
};

const updateStatus = (req, res) => {
  let id = req.params.id;
  let list = readFile();
  let index = list.findIndex((items) => {
    return items.id == id;
  });
  if (index == -1) {
    res.status(404).json({ msg: "Not found" });
  } else {
    if (list[index].status == "pending") {
      list[index].status = "completed";
    } else {
      res.status(404).json({ msg: "Status is already set as completed" });
    }
    writeFile(list);
    res.status(200).json({ msg: "Success", ticketDetails: list });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  updateStatus,
};
