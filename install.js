// Installationsfil för databasen PostgreSQL.
const { Client } = require('pg');
require('dotenv').config();

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
        console.log('Fel vid anslutning till databasen:', error);
        return;
    } else {
        console.log('Anslutningen till databasen lyckades!');
        createTable();
    }
});

async function createTable() {
    try {
        // Tar bort tabellen om den redan finns sedan tidigare
        await client.query(`
            DROP TABLE IF EXISTS course;`);

        // Skapar tabellen course
        await client.query(`
        CREATE TABLE IF NOT EXISTS course (
            id SERIAL PRIMARY KEY,
            code VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            progression VARCHAR(255) NOT NULL,
            syllabus TEXT NOT NULL,
            posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);
        `);

        // Lägger till data i course
        await client.query(`
        INSERT INTO course (code, name, progression, syllabus)
        VALUES 
            ('DT224G', 'Introduktion till webbutveckling med HTML, CSS och JavaScript', 'A', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT224G/'),
            ('DT200G', 'Grafisk teknik för webb', 'A', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT200G/'),
            ('DT068G', 'Webbanvändbarhet', 'B', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT068G/'),
            ('DT003G', 'Databaser', 'A', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT003G/'),
            ('DT211G', 'Frontend-baserad webbutveckling', 'B', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT211G/');
        `);
        console.log('Tabellen course skapades och data med kurser lades till!');
    } catch (error) {
        console.log('Fel när tabellen skapades:', error);
    } finally {
        await client.end();
    }
}