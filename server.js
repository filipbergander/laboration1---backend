const express = require('express');

const bodyParser = require('body-parser');
const { render } = require('ejs');
const sqlite3 = require("sqlite3").verbose();

// Anslut till databas
const db = new sqlite3.Database("./db/cv.db");

const app = express();
const port = 3000;
app.set("view engine", "ejs"); // views mappen
app.use(express.static("public")); // public mappen

app.use(bodyParser.urlencoded({ extended: true }));

// Starta server
app.listen(port, () => {
    console.log("Servern kör på port: " + port);
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/newcourse", (req, res) => {
    res.render("newcourse");
});