/////// SET UP EXPRESS ////////
// importing in a package
// the name of the package is 'express'
// we are going to refer to it using the variable 'express'
const express = require("express");
// import the hbs package. send alot of HTML back to the browser
const hbs = require("hbs");

// create an express app
let app = express();

////// ROUTES ////////
// a route is to assiociate a URL on the server with a js function
// such that when that associated URL on the server is accessed.
// the associated JS function will run
app.set("view engine", "hbs");
// add routes here

// req is waht the browser send to the server
app.get("/", function (req, res) {
  // res is what we send back to the server
  res.send("<h1>Hello from Express 3</h1>");
});

app.get("/about-us", function (req, res) {
  res.send("<h1>About Us</h1>");
});

app.get("/contact-us", function (req, res) {
  res.render("contact-us");
});

app.get("/luckynumber", function (req, res) {
  let luckynumber = Math.floor(Math.random() * 1000 + 1);
  res.render("lucky", {
    number: luckynumber,
  });
});

// :<whatever defines a placeholder>
// :name defines a placeholder with the name 'name'
app.get("/hello/:name", (req, res) => {
  // req stands for request
  // it refers to whatever the client (usually the web browser) sends to the server
  let name = req.params.name;
  res.send("Hi, " + name);
});

// START THE SERVER, make sure all routes are defined before starting the server
app.listen(3000, () => {
  console.log("Server started");
});
