const express = require("express");

const app = express();

app.get("/home", (req, res) => {
  res.status(200).send(`<h1>Welcome to Home Page.</h1>`);
});

app.get("/aboutus", (req, res) => {
  res.status(200).json({ message: "Welcome to About Us" });
});

app.get("/contactus", (req, res) => {
  const data = "xyz";
  if (data.length == 0) {
    res.status(404).send("Unable to find data");
  } else {
    res.status(200).send(data);
  }
});

app.use((req, res) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

app.listen(3000, () => {
  console.log("Server is running on 3000 port.");
});
