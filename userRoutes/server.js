const express = require("express");
const fs = require("fs");

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to home page");
});

app.get("/users/get/:id", (req, res) => {
  try {
    const userData = fs.readFileSync("users.json", "utf-8");
    const users = JSON.parse(userData);

    const user = users.find((u) => u.id == req.params.id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.get("/users/list", (req, res) => {
  const userData = fs.readFileSync("users.json", "utf-8");
  if (userData.length > 0) {
    res.status(404).send(userData);
  } else {
    res.status(404).send("Data not found");
  }
});

// Error routing
app.get((req, res) => {
  res.status().json("Something wen wrong.");
});

app.listen(3000, () => {
  console.log("Server is running");
});
