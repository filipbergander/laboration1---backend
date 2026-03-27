const express = require('express');
const bodyParser = require('body-parser');
const { render } = require('ejs');
const sqlite3 = require("sqlite3").verbose();

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
    db.all("SELECT * FROM course;", (err, rows) => {
        if (err) {
            console.error(err);
        }
        res.render("index");
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});
app.get("/newcourse", (req, res) => {
    res.render("newcourse");
});

app.post("/", (req, res) => {
    let coursecode = req.body.code;
    let coursename = req.body.name;
    let progression = req.body.progression;
    let syllabus = req.body.syllabus;

    if (coursecode.length > 0 && coursename.length > 0 && progression.length > 0 && syllabus.length > 0) {
        const statement = db.prepare(`INSERT INTO course (code, name, progression, syllabus) VALUES (?, ?, ?, ?);`);
        statement.run(coursecode, coursename, progression, syllabus);
        statement.finalize();
    } else {
        console.log("Alla fält måste fyllas i!");
    }
    res.redirect("/newcourse");
});