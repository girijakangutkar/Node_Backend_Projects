const express = require("express");
const fs = require("fs");
const { json } = require("stream/consumers");

const app = express();

app.use(express.json());

//Add a new dish.
app.post("/dishes", (req, res) => {
  let menu = req.body;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let menuList = data;
  let id = menuList[menuList.length - 1].id + 1;
  menu = { ...menu, id };
  menuList.push(menu);
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(201).json({ msg: "Added" });
});

// Retrieve all dishes.
app.get("/dishes", (req, res) => {
  const allDishes = fs.readFileSync("db.json", "utf-8");
  if (allDishes.length > 0) {
    res.status(200).json({ allDishes });
  } else {
    res.status(404).json("Menu list is empty.");
  }
});

//Retrieve a dish by its id
app.get("/dishes/:id", (req, res) => {
  let dishId = req.params.id;
  let menu = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dish = menu.find((item) => item.id == dishId);

  if (!dish) {
    res.status(404).json({ message: "Dish is not available." });
  } else {
    res.status(200).json({ msg: "Menu list", menu: dish });
  }
});

//Retrieve by query
// Search by name
app.get("/dishesName", (req, res) => {
  let nameQuery = req.query.name;
  let menu = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dish = menu.find((item) => item.name == nameQuery);

  if (!dish) {
    res.status(404).json({ message: "Dish is not available." });
  } else {
    menu.forEach((ele, id) => {
      if (ele.name.includes(nameQuery)) {
        res.json({ msg: "Success", dish: ele });
      }
    });
  }
});

//Update dish by its id
app.put("/dishes/:id", (req, res) => {
  let id = req.params.id;
  let menu = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

  let index = menu.findIndex((item) => item.id == id);
  if (index === -1) {
    res.status(404).json({ msg: "Dish is not available in menu" });
  } else {
    menu[index] = { ...menu[index], ...req.body };
    fs.writeFileSync("./db.json", JSON.stringify(menu, null, 2));
    res.json({ msg: "Success", updatedDish: menu[index] });
  }
});

//Delete a dish by its id
app.delete("/dishes/:id", (req, res) => {
  let id = req.params.id;
  let menu = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let index = menu.findIndex((item) => item.id == id);

  if (index == -1) {
    return res.status(404).json({ msg: "Dish not available" });
  }
  menu.splice(index, 1);
  fs.writeFileSync("./db.json", JSON.stringify(menu, null, 2));
  res.status(200).json({ msg: "Success" });
});

//Error if no routes are present.
app.get((req, res) => {
  res.status(404).send("Error! Not Found.");
});

app.listen(3000, () => {
  console.log("Server is running!");
});
