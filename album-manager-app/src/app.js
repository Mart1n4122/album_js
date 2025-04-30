import express from 'express';
import cors from 'cors';
import { dbAll, initializeDatabase, dbGet, dbRun } from './database/db.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({ message: `Error: ${err.message}` });
    }
});

app.get('/albums', async (req, res) => {
    try {
        const albums = await dbAll('SELECT * FROM albums');
        res.status(200).json(albums);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching albums', error: error.message });
    }
});

app.get('/albums/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const album = await dbGet('SELECT * FROM albums WHERE id = ?', [id]);
        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        const songs = await dbAll('SELECT * FROM songs WHERE albumId = ?', [id]);
        res.status(200).json({ ...album, songs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching album', error: error.message });
    }
});

app.post('/albums', async (req, res) => {
    const { band, title, songCount, totalLength, songs } = req.body;

    if (!band || !title || !songCount || !totalLength || !Array.isArray(songs)) {
        return res.status(400).json({ message: 'Band, title, songCount, totalLength, and songs are required' });
    }

    try {
        const result = await dbRun(
            'INSERT INTO albums (band, title, songCount, totalLength) VALUES (?, ?, ?, ?)',
            [band, title, songCount, totalLength]
        );

        const albumId = result.lastID;

        for (const { title: songTitle, length } of songs) {
            await dbRun('INSERT INTO songs (albumId, title, length) VALUES (?, ?, ?)', [albumId, songTitle, length]);
        }

        res.status(201).json({ id: albumId, band, title, songCount, totalLength, songs });
    } catch (error) {
        res.status(500).json({ message: 'Error adding album', error: error.message });
    }
});

app.put('/albums/:id', async (req, res) => {
    const id = req.params.id;
    const { band, title, songCount, totalLength, songs } = req.body;

    if (!band || !title || !songCount || !totalLength || !Array.isArray(songs)) {
        return res.status(400).json({ message: 'Band, title, songCount, totalLength, and songs are required' });
    }

    try {
        const album = await dbGet('SELECT * FROM albums WHERE id = ?', [id]);
        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        await dbRun(
            'UPDATE albums SET band = ?, title = ?, songCount = ?, totalLength = ? WHERE id = ?',
            [band, title, songCount, totalLength, id]
        );

        await dbRun('DELETE FROM songs WHERE albumId = ?', [id]);

        for (const { title: songTitle, length } of songs) {
            await dbRun('INSERT INTO songs (albumId, title, length) VALUES (?, ?, ?)', [id, songTitle, length]);
        }

        res.status(200).json({ id: +id, band, title, songCount, totalLength, songs });
    } catch (error) {
        res.status(500).json({ message: 'Error updating album', error: error.message });
    }
});

app.delete('/albums/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const album = await dbGet('SELECT * FROM albums WHERE id = ?', [id]);
        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        await dbRun('DELETE FROM albums WHERE id = ?', [id]);
        res.status(200).json({ message: 'Album deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting album', error: error.message });
    }
});

async function startServer() {
    try {
        await initializeDatabase();
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.error('Error initializing database:', error.message);
    }
}

startServer();