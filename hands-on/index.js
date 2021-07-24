// import in the packages
const { default: axios } = require("axios");
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
  res.send("Hello World");
});

app.get("/movies", async function (req, res) {
  let response = await axios.get("https://ckx-movies-api.herokuapp.com/movies");
  res.render("movies.hbs", { movies: response.data });
});

app.get("/movie/create", async function (req, res) {
  console.log(res.body);
  res.render("create_movie");
});

app.post("/movie/create", async function (req, res) {
  let newMovie = {
    id: Math.floor(Math.random() * 1000000 + 10000),
    title: req.body.title,
    plot: req.body.plot,
  };
  await axios.post("https://ckx-movies-api.herokuapp.com/movies/create");
  res.redirect("/movies");
  l;
});

app.get("/movie/:movie_id/update", async function (req, res) {
  let movieID = req.params.movie_id;
  // step 1: retrieve the information of the pet that the user
  // wants to update and display in the form
  // get the information of the record that we want to update
  let response = await axios.get(
    "https://ckx-movies-api.herokuapp.com/movie/" + movieID
  );
  // display the information of the record in the form
  res.render("edit_movie", {
    movie: response.data,
  });
});

// step 2: update the pet base on the user's input
app.post("/movie/:movie_id/update", async function (req, res) {
  let movie_id = req.params.movie_id;
  // write the changes back to the database
  let movie = {
    title: req.body.title,
    plot: req.body.plot,
  };
  await axios.patch(
    "https://ckx-movies-api.herokuapp.com/movie/" + movie_id,
    movie
  );
  res.redirect("/movies");
});

app.get("/movie/:movie_id/delete", async function (req, res) {
  let movie_id = req.params.movie_id;
  // get the information of the record that we want to date
  let response = await axios.get(
    "https://ckx-movies-api.herokuapp.com/movie/" + movie_id
  );
  res.render("confirm_delete", {
    movie: response.data,
  });
});

app.post("/movie/:movie_id/delete", async function (req, res) {
  let movie_id = req.params.movie_id;
  await axios.delete("https://ckx-movies-api.herokuapp.com/movie/" + movie_id);
  res.redirect("/movies");
});

// start the server
app.listen(3000, function () {
  console.log("server started");
});
