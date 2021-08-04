// import in the packages
const e = require("express");
const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");

let app = express();
app.set("view engine", "hbs");

// Inform Express where to find static images, css and
// client-side (ie. browser)
app.use(express.static("public"));

// Setup Wax On (for templates with HBS)
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get("/", function (req, res) {
  res.send("Hello");
});

// define my routes
app.get("/add_food", function (req, res) {
  res.render("add_food");
});

app.post("/add_food", function (req, res) {
  console.log(req.body);
  let fullname = req.body.fullname;
  res.send("Thank you, " + fullname);

  // how to handle checkboxes
  // if it is undefined, change it to store an empty array
  // if it is just a string, convert it to an array containing that single string
  // if it is an array, then leave it as it is

  //   let tags = [];
  //   // check if req.body.tags is defined
  //   // if req.body.tags is undefined, it is equivalent to false
  //   if (req.body.tags) {
  //     // check if req.body.tages is an array
  //     if (Array.isArray(req.body.tags)) {
  //       tags = req.body.tags;
  //     }
  //     // if req/nody/tags is not an arrays, then it must be a single string
  //     else {
  //       tags = [req.body.tags];
  //     }
  //   }

  // Alternative method
  let tags = req.body.tags || [];
  tags = Array.isArray(tags) ? tags : [tags];
  console.log("Selected tags= ", tags);

  let cuisine = req.body.cuisine;
  console.log("Selected cuisine is", cuisine);

  let ingredients = req.body.ingredients || [];
  ingredients = Array.isArray(ingredients) ? ingredients : [ingredients];
  console.log("Selected ingredients= ", ingredients);
});

app.get("/show-number-form", function (req, res) {
  res.render("add_numbers");
});

app.post("/show-number-form", function (req, res) {
  console.log(req.body);
  let number1 = req.body.first_number;
  let number2 = req.body.second_number;
  let total = parseInt(number1) + parseInt(number2);
  let operation = req.body.operation;
  if (operation == "add") {
    total = total;
  }
  if (operation == "subtract") {
    total = parseInt(number1) - parseInt(number2);
  }
  if (operation == "multiply") {
    total = parseInt(number1) * parseInt(number2);
  }
  //   res.send("sum = " + total);
  res.render("sum", {
    total: total,
  });
});

app.get("/calculate-bmi", function (req, res) {
  res.render("calculate_bmi");
});

app.post("/calculate-bmi", function (req, res) {
  let { weight, height } = req.body;
  let bmi = (parseFloat(weight) / parseFloat(height) ** 2).toFixed(2);

  console.log(bmi);
  res.render("display_bmi", {
    bmi: bmi,
  });
});

app.get("/calculate-fruits", function (req, res) {
  res.render("calculate_fruits_cost");
});

app.post("/calculate-fruits", function (req, res) {
  let items = req.body.items || [];
  items = Array.isArray(items) ? items : [items];
  let cost = 0;
  let fruits = { apple: 3, durian: 15, orange: 6, banana: 4 };
  for (let i in fruits) {
    if (items.includes(i)) cost += fruits[i];
  }
  res.render("display_fruits_cost", {
    cost: cost,
  });
});

app.get("/lost-and-found", function (req, res) {
  res.render("lost_and_found");
});

app.post("/lost-and-found", function (req, res) {
  let description = req.body.description || [];
  description = Array.isArray(description) ? description : [description];
  console.log("Selected description= ", description);
  let { itemname, email, mode } = req.body;
  console.log(itemname, email, mode);

  if (
    itemname.length > 3 &&
    itemname.length < 200 &&
    email.includes("@") &&
    mode &&
    description.length > 0
  ) {
    res.send("Form Submitted");
  } else {
    res.render("lost_and_found");
  }
});

// start the server
app.listen(3000, function () {
  console.log("server started");
});
