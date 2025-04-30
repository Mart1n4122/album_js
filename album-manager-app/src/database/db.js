const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./albums.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

function initialize() {
    db.run(`
        CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            band_name TEXT NOT NULL,
            album_title TEXT NOT NULL,
            number_of_songs INTEGER NOT NULL,
            release_year INTEGER NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Albums table created or already exists.');

            const insert = `
                INSERT INTO albums (band_name, album_title, number_of_songs, release_year)
                VALUES (?, ?, ?, ?)
            `;
            db.run(insert, ['Pink Floyd', 'The Dark Side of the Moon', 10, 1973]);
            db.run(insert, ['The Beatles', 'Abbey Road', 17, 1969]);
            db.run(insert, ['Nirvana', 'Nevermind', 12, 1991]);
            db.run(insert, ['Metallica', 'Master of Puppets', 8, 1986]);
            console.log('Default data inserted.');
        }
    });
}

module.exports = { db, initialize };