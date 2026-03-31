const sqllite3 = require("sqlite3").verbose();

// Skapa databas
const db = new sqllite3.Database("./db/cv.db");

// Skapa tabell
db.serialize(() => {
    db.run("DROP TABLE IF EXISTS course;");

    db.run(`
    CREATE TABLE course(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        progression TEXT NOT NULL,
        syllabus TEXT NOT NULL,
        posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    `);
    db.run(`INSERT INTO course (code, name, progression, syllabus) VALUES ("DT224G", "Introduktion till webbutveckling med HTML, CSS och JavaScript", "A", "https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT224G/"), ("DT200G", "Grafisk teknik för webb", "A", "https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT200G/"), ("DT068G", "Webbanvändbarhet", "B", "https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT068G/"), ("DT003G", "Databaser", "A", "https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT003G/"), ("DT211G", "Frontend-baserad webbutveckling", "B", "https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT211G/");
`);
});
db.close();