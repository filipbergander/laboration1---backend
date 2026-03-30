const sqllite3 = require("sqlite3").verbose();

// Skapa databas
const db = new sqllite3.Database("./db/cv.db");

// Skapa tabell
db.serialize(() => {
    db.run("DROP TABLE IF EXISTS course;");

    db.run(`
    CREATE TABLE course(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        progression TEXT NOT NULL,
        syllabus TEXT NOT NULL,
        posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    `);
});
db.close();