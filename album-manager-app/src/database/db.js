import sqlite from 'sqlite3';
const db = new sqlite.Database('./albums.sqlite');

export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
}

export function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));
}

export function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
    }));
}

function calculateTotalLength(songs) {
    let totalSeconds = 0;
    for (const [_, length] of songs) {
        const parts = length.split(":").map(Number);
        if (parts.length === 2) {
            totalSeconds += parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
            totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return hours > 0
        ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export async function initializeDatabase() {
    await dbRun("DROP TABLE IF EXISTS albums");
    await dbRun("DROP TABLE IF EXISTS songs");

    await dbRun(`CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        band TEXT,
        title TEXT,
        songCount INTEGER,
        totalLength TEXT
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        albumId INTEGER,
        title TEXT,
        length TEXT,
        FOREIGN KEY (albumId) REFERENCES albums(id) ON DELETE CASCADE
    )`);

    const songs1 = [
        ["OUT WEST", "2:37"],
        ["GATTI", "3:01"],
        ["WHAT TO DO?", "4:10"],
        ["GANG GANG", "4:04"],
        ["JACKBOYS", "0:46"],
    ];
    const totalLength1 = calculateTotalLength(songs1);

    // JACKBOYS
    const albumId1 = (await dbRun(
        "INSERT INTO albums (band, title, songCount, totalLength) VALUES (?, ?, ?, ?)",
        ["JACKBOYS, Travis Scott, Young Thug, Don Toliver, Pop Smoke", "JACKBOYS", songs1.length, totalLength1]
    )).lastID;

    for (const [title, length] of songs1) {
        await dbRun("INSERT INTO songs (albumId, title, length) VALUES (?, ?, ?)", [albumId1, title, length]);
    }

    // ASTROWORLD
    const songs2 = [
        ["STARGAZING", "4:30"],
        ["CAROUSEL", "3:00"],
        ["SICKO MODE", "5:12"],
        ["R.I.P. SCREW", "3:06"],
        ["STOP TRYING TO BE GOD", "5:38"],
        ["NO BYSTANDERS", "3:38"],
        ["SKELETONS", "2:25"],
        ["WAKE UP", "3:51"],
        ["5% TINT", "3:16"],
        ["NC-17", "2:36"],
        ["ASTROTHUNDER", "2:22"],
        ["YOSEMITE", "2:30"],
        ["CAN'T SAY", "3:18"],
        ["WHO? WHAT!", "2:56"],
        ["BUTTERFLY EFFECT", "3:10"],
        ["HOUSTONFORNICATION", "3:38"],
        ["COFFEE BEAN", "3:29"],
    ];
    const totalLength2 = calculateTotalLength(songs2);

    const albumId2 = (await dbRun(
        "INSERT INTO albums (band, title, songCount, totalLength) VALUES (?, ?, ?, ?)",
        ["Travis Scott", "ASTROWORLD", songs2.length, totalLength2]
    )).lastID;

    for (const [title, length] of songs2) {
        await dbRun("INSERT INTO songs (albumId, title, length) VALUES (?, ?, ?)", [albumId2, title, length]);
    }

    // PLAYBOI CARTI
    const songs3 = [
        ["LOCATION", "2:48"],
        ["Magnolia", "3:01"],
        ["LOOKIN", "3:03"],
        ["WOKEUP LIKE THIS*", "3:55"],
        ["LET IT GO", "2:30"],
        ["HALF & HALF", "3:47"],
        ["NEW CHOPPA", "2:06"],
        ["OTHER SHIT", "2:48"],
        ["NO. 9", "3:19"],
        ["DOTHATSHIT!", "3:04"],
        ["LAME NIGGAZ", "2:53"],
        ["YAH MEAN", "2:45"],
        ["FLEX", "4:00"],
        ["KELLY K", "4:31"],
        ["HAD 2", "2:19"],
    ];
    const totalLength3 = calculateTotalLength(songs3);

    const albumId3 = (await dbRun(
        "INSERT INTO albums (band, title, songCount, totalLength) VALUES (?, ?, ?, ?)",
        ["Playboi Carti", "Playboi Carti", songs3.length, totalLength3]
    )).lastID;

    for (const [title, length] of songs3) {
        await dbRun("INSERT INTO songs (albumId, title, length) VALUES (?, ?, ?)", [albumId3, title, length]);
    }
}