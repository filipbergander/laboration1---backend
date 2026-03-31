require("dotenv").config(); // För att hämta in env-filen

const express = require('express'); // Express-verktyget
const bodyParser = require('body-parser'); // För att läsa in data från forumulär 
const sqlite3 = require("sqlite3").verbose(); // SQlite3 

const db = new sqlite3.Database("process.env.DB_PATH"); // Ansluter till databasen

const app = express();
const port = process.env.PORT || 3000; // Porten som servern ska köra på, hämtas från env-filen eller port 3000.

app.use(express.static("public")); // public mappen
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // views mappen

// Routes
app.get("/", (req, res) => {
    db.all("SELECT * FROM course;", (err, rows) => {
        if (err) {
            console.error(err);
        }
        res.render("index", { courses: rows });
        console.log(rows);
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});
// Skickar med värden som är tomma för att inte få felmeddelanden i början av programmet innan nya kurser lagts till
app.get("/newcourse", (req, res) => {
    res.render("newcourse", {
        errMessage: [],
        coursecode: "",
        coursename: "",
        progression: "",
        syllabus: ""
    });
});
// För att lägga till en ny kurs
app.post("/", (req, res) => {
    // Läser in data från formuläret
    let courseid = req.body.id;
    let coursecode = req.body.code;
    let coursename = req.body.name;
    let progression = req.body.progression.toUpperCase();
    let syllabus = req.body.syllabus;
    let posted = req.body.posted;

    // Array för felmeddelanden
    let errMessage = [];
    console.log(errMessage);

    // Felmeddelande för respektive inputfält
    if (coursecode === "") {
        errMessage.push("Ange kurskod!");
    }

    if (coursename === "") {
        errMessage.push("Ange kursnamn!");
    }

    if (progression === "") {
        errMessage.push("Ange progression!");
    } else if (progression !== "A" && progression !== "B") {
        errMessage.push("Progression måste vara A eller B!");
    }

    if (syllabus === "") {
        errMessage.push("Ange kursplan!");
    } else if (!syllabus.includes("http") || !syllabus.includes("https")) {
        errMessage.push("Ange en giltig URL!")
    }
    // Om det finns errors, renderas newcourse igen med felmeddelandena
    if (errMessage.length > 0) {
        res.render("newcourse", {
            errMessage,
            coursecode,
            coursename,
            progression,
            syllabus
        });
        // Annars om inga fel finns körs sql-frågan och kursen läggs till, index-sidan renderas då om allt går igenom.
    } else if (errMessage.length === 0) {
        const statement = db.prepare(`INSERT INTO course (code, name, progression, syllabus) VALUES (?, ?, ?, ?);`);
        statement.run(coursecode, coursename, progression, syllabus); // Stoppar in värdena i frågan
        statement.finalize();

        res.redirect("/"); // Startsidan
    }
});

// För att radera en kurs
app.get("/delete/:id", (req, res) => {
    let id = req.params.id;
    db.run("DELETE FROM course WHERE id=?;", id, (error) => {
        if (error) {
            console.log(error.message);
        }
        res.redirect("/");
    });
});


// Starta server
app.listen(port, () => {
    console.log("Servern kör på port: " + port);
    console.log("http://localhost:" + port);
});