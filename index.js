const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
const fs = require("fs");
const { render } = require("pug");

app.set("views", "./views");
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: false }));

var teamsList = fs.readFileSync("./teams.json", "utf-8");
teamsList = JSON.parse(teamsList);

// ===========================
// VIEWS
// ===========================

// View: Home
app.get("/", (req, res) => {
  res.render("home", {
    length: teamsList.length,
  });
});

// View: Teams
app.get("/teams", (req, res) => {
  res.render("teams", {
    teams: teamsList,
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
  console.log("going to edit", teamsList[req.params.index].teamname);

  res.render("form", {
    header: "Edite um time",
    formAction: `/edit/${req.params.index}`,
    field1: teamsList[req.params.index].teamname,
    field2: teamsList[req.params.index].year,
    field3: teamsList[req.params.index].manager,
  });
});

// View: Team Details
app.get("/team/:index", (req, res) => {
  res.render("team", {
    teamsList,
    team: teamsList[req.params.index].teamname,
    year: teamsList[req.params.index].year,
    manager: teamsList[req.params.index].manager,
    players: teamsList[req.params.index].players,
    teamindex: req.params.index,
  });
});

// ===========================
// CRUD: Teams
// ===========================

// Create
app.post("/submit", (req, res) => {
  let newTeam = req.body;
  newTeam.players = [];

  teamsList.push(newTeam);
  console.log(teamsList);
  fs.writeFileSync("./teams.json", JSON.stringify(teamsList));

  res.redirect("/teams");
});

// Delete
app.get("/delete/:index", (req, res) => {
  teamsList.splice(req.params.index, 1);
  fs.writeFileSync("./teams.json", JSON.stringify(teamsList));

  res.redirect("/teams");
});

// Update/Edit
app.post("/edit/:index", (req, res) => {
  teamsList[req.params.index].teamname = req.body.teamname;
  teamsList[req.params.index].year = req.body.year;
  teamsList[req.params.index].manager = req.body.manager;

  res.redirect("/teams");
});

// ===========================
// CRUD: Players
// ===========================

// Create
app.post("/new-player/:index", (req, res) => {
  teamsList[req.params.index].players.push(req.body.newplayer);
  fs.writeFileSync("./teams.json", JSON.stringify(teamsList));

  res.redirect(`/team/${req.params.index}`);
});

// Delete
app.get("/delete-player/:team/:player", (req, res) => {
  teamsList[req.params.team].players.splice(req.params.player, 1);
  fs.writeFileSync("./teams.json", JSON.stringify(teamsList));

  res.redirect(`/team/${req.params.team}`);
});

// ===========================
// LISTEN:
// ===========================

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
