// import in the packages
const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const MongoUtil = require("./MongoUtil");
const ObjectId = require("mongodb").ObjectId;

// setup environmental variables to store the mongo connection string
require("dotenv").config();

let app = express();
app.set("view engine", "hbs");

// Inform Express where to find static images, css and
// client-side (ie. browser)
app.use(express.static("public"));

// Setup Wax On (for templates with HBS)
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

const helpers = require("handlebars-helpers");
helpers({
  handlebars: hbs.handlebars,
});

// enable forms
app.use(
  express.urlencoded({
    extended: false,
  })
);

async function main() {
  // have to connect to the mongo database before
  // setting up the routes
  await MongoUtil.connect(process.env.MONGO_URI, "tgc13_animal_shelter");

  // ROUTES
  // set up the express routes after we
  // connect to the database
  app.get("/", function (req, res) {
    res.send("Hello world");
  });

  app.get("/animals_record", async function (req, res) {
    // 1. get from mongo all the animals records
    let db = MongoUtil.getDB();
    let animalsRecords = await db.collection("animals").find().toArray();
    res.render("animals", {
      animalsRecords: animalsRecords,
    });
  });

  app.get("/animals_record/create", function (req, res) {
    res.render("add_animal");
  });

  app.post("/animals_record/create", function (req, res) {
    let name = req.body.name;
    let age = req.body.age;
    let type = req.body.type;
    let gender = req.body.gender;
    let notes = req.body.notes;

    // insert into the Mongo DB
    // getg an instance of the database client
    let db = MongoUtil.getDB();
    db.collection("animals").insertOne({
      name: name,
      age: age,
      type: type,
      gender: gender,
      notes: notes,
    });
    res.redirect("/animals_record");
  });

  app.get("/animals_record/:id/update", async function (req, res) {
    let id = req.params.id;
    // find the doucment we want to update
    let db = MongoUtil.getDB();
    let animalRecord = await db.collection("animals").findOne({
      _id: ObjectId(id),
    });

    res.render("edit_animal", {
      animalRecord: animalRecord,
    });
  });

  app.post("/animals_record/:id/update", async function (req, res) {
    let id = req.params.id;
    let name = req.body.name;
    let age = req.body.age;
    let type = req.body.type;
    let gender = req.body.gender;
    let notes = req.body.notes;

    let db = MongoUtil.getDB();
    db.collection("animals").updateOne(
      {
        _id: ObjectId(id),
      },
      {
        $set: {
          name: name,
          age: age,
          type: type,
          gender: gender,
          notes: notes,
        },
      }
    );
    res.redirect("/animals_record");
  });

  app.get("/animals_record/:id/delete", async function (req, res) {
    let id = req.params.id;
    let db = MongoUtil.getDB();
    let animalRecord = await db.collection("animals").findOne({
      _id: ObjectId(id),
    });

    res.render("delete_animal", {
      animalRecord: animalRecord,
    });
  });

  app.post("/animals_record/:id/delete", async function (req, res) {
    let id = req.params.id;
    let db = MongoUtil.getDB();
    await db.collection("animals").deleteOne({
      _id: ObjectId(id),
    });

    res.redirect("/animals_record");
  });
}

main();

// START SERVER
app.listen(3000, function (req, res) {
  console.log("Server started");
});
