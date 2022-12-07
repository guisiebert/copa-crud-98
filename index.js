const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
const fs = require("fs");
const { render } = require("pug");

app.set("views", "./views");
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: false }));

const internalTeamsList = [
  {
    teamname: "Brazil",
    year: 1998,
    manager: "Zagalo",
    players: ["Taffarel", "Ronaldo", "Cafu"],
  },
  {
    teamname: "Scotland",
    year: 1998,
    manager: "Craig Brown",
    players: ["Jim Leighton", "Colin Calderwood", "Colin Hendry", "Tom Boyd"],
  },
];

// ===========================
// VIEWS
// ===========================

// View: Home
app.get("/", (req, res) => {
  res.render("home", {
    length: internalTeamsList.length,
  });
});

// View: Teams
app.get("/teams", (req, res) => {
  res.render("teams", {
    internalTeamsList,
  });
});

// View: Create Form
app.get("/form", (req, res) => {
  res.render("form", {
    header: "Adicione um novo time",
    formAction: "/submit",
  });
});

// View: Edit Form
app.get("/edit/:index", (req, res) => {
  console.log("going to edit", internalTeamsList[req.params.index].teamname);

  res.render("form", {
    header: "Edite um time",
    formAction: `/edit/${req.params.index}`,
    field1: internalTeamsList[req.params.index].teamname,
    field2: internalTeamsList[req.params.index].year,
    field3: internalTeamsList[req.params.index].manager,
  });
});

// View: Team Details
app.get("/team/:index", (req, res) => {
  res.render("team", {
    internalTeamsList,
    team: internalTeamsList[req.params.index].teamname,
    year: internalTeamsList[req.params.index].year,
    manager: internalTeamsList[req.params.index].manager,
    players: internalTeamsList[req.params.index].players,
    teamindex: req.params.index,
  });
});

// ===========================
// CRUD: Teams
// ===========================

// Create
app.post("/submit", (req, res) => {
  let newTeam = req.body;
  console.log(newTeam);
  newTeam.players = [];

  internalTeamsList.push(newTeam);

  res.redirect("/teams");
});

// Delete
app.get("/delete/:index", (req, res) => {
  console.log("Deleting team #", req.params.index);
  internalTeamsList.splice(req.params.index, 1);

  res.redirect("/teams");
});

// Update/Edit
app.post("/edit/:index", (req, res) => {
  console.log("received info", req.body);

  internalTeamsList[req.params.index].teamname = req.body.teamname;
  internalTeamsList[req.params.index].year = req.body.year;
  internalTeamsList[req.params.index].manager = req.body.manager;

  res.redirect("/teams");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ===========================
// CRUD: Players
// ===========================

// Create
app.post("/new-player/:index", (req, res) => {
  console.log("Params: ", req.params);
  console.log("Body: ", req.body);

  internalTeamsList[req.params.index].players.push(req.body.newplayer);

  res.redirect(`/team/${req.params.index}`);
});

// Delete
app.get("/delete-player/:team/:player", (req, res) => {
  console.log(req.params);

  internalTeamsList[req.params.team].players.splice(req.params.player, 1);

  res.redirect(`/team/${req.params.team}`);
});
