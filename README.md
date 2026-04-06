## Laboration 1 - Backend-baserad webbutveckling

Skapar en applikation som hämtar in kurser från Mittuniversitets hemsida och presenterar dem på startsidan genom en databas.
Skulle kunna likna ett CV där man visar upp vilka kurser som man avklarat. Går sedan att lägga till fler kurser under sidan "Lägg till kurs".
Använde i början SQLite3 som databashanterare men valde senare att gå över till PostgreSQL eftersom det uppstod problem när jag skulle publicera hemsidan.

**Webbplats:** https://fb-lab1-backend.onrender.com/

### Sidor
- Startsida/hem där kurserna presenteras med kurskod, kursnamn, nivå(progression), kursplan med länk samt datum & tid när man skapade posten.
- Lägg till kurs, för att lägga till en ny kurs till sitt "CV".
- Om, förklaring om momentet samt reflektioner.

### Detaljer
**Installationsskriptet** finns i rotmappen: install.js. Inom install.js skapas tabellen samt infogas data till en början genom redan befintliga kurser.

**ER-diagrammet** som beskriver databasens struktur finns inom er_diagram -> db.drawio.
ER-diagrammet beskriver databasen för CV:et.
- Tabell som finns: courses
- Primärnyckel: course_id som är satt med SERIAL (Auto_increment)

Attribut:
- Coursecode, coursename, syllabus, progression samt date_created (när posten blev gjord)

<div align="center">
<img width="441" height="360" alt="er-diagram" src="https://github.com/user-attachments/assets/132b31cb-8913-471c-95f1-6afdb68d4e21" />
</div>

Av Filip Bergander 2026, Mittuniversitetet
