const { Client } = require("pg");
require("dotenv").config(); // För att hämta in env-filen
const express = require('express'); // Express-verktyget
const app = express();
const bodyParser = require('body-parser'); // För att läsa in data från forumulär 

app.use(express.static("public")); // public mappen
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // views mappen

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect((error) => {
    if (error) {
        console.log("Fel vid anslutning till databasen:", error);
        return;
    } else {
        console.log("Anslutningen till databasen lyckades!");
    }
});

// Routes
app.get("/", async(req, res) => {
    try {
        const result = await client.query('SELECT * FROM course ORDER BY id DESC;');
        res.render("index", { courses: result.rows });
    } catch (error) {
        console.error("Fel vid inhämtning av tabell course:", error);
    }
});

app.get("/about", (req, res) => {
    res.render("about");
});
// Skickar med värden som är tomma för att inte få felmeddelanden i början av programmet innan nya kurser lagts till
app.get("/newcourse", async(req, res) => {
    res.render("newcourse", {
        errMessage: [],
        coursecode: "",
        coursename: "",
        progression: "",
        syllabus: ""
    });
});
// För att lägga till en ny kurs
app.post("/", async(req, res) => {
    // Läser in data från formuläret
    let courseid = req.body.id;
    let coursecode = req.body.code;
    let coursename = req.body.name;
    let progression = req.body.progression.toUpperCase();
    let syllabus = req.body.syllabus;
    let posted = req.body.posted;

    // Array för felmeddelanden
    let errMessage = [];

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
    } else if (!syllabus.startsWith("http")) {
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
        try { // Sätter in värdena i databasen
            const result = await client.query(
                'INSERT INTO course (code, name, progression, syllabus) VALUES ($1, $2, $3, $4)', [coursecode, coursename, progression, syllabus]
            );
            console.log("Kursen lades till i databasen!");
            res.redirect("/"); // Returnerar startsidan
        } catch (error) {
            console.log(error.message);
        }
    }
});

// För att radera en kurs
app.get("/delete/:id", async(req, res) => {
    try {
        let id = req.params.id;
        await client.query('DELETE FROM course WHERE id=$1', [id]);
        res.redirect("/");
        console.log("Kursen raderades från databasen!");
    } catch (error) {
        console.error("Fel vid radering av kurs:", error);
    }
});

// Starta applikationen
app.listen(process.env.PORT, () => {
    console.log("Servern kör på port: " + process.env.PORT);
    console.log("http://localhost:" + process.env.PORT);
});