class AlbumController {
    constructor(albumModel) {
        this.albumModel = albumModel;
    }

    async addAlbum(req, res) {
        const { bandName, albumTitle, numberOfSongs, releaseYear } = req.body;
        try {
            const newAlbum = await this.albumModel.addAlbum({ bandName, albumTitle, numberOfSongs, releaseYear });
            res.status(201).json(newAlbum);
        } catch (error) {
            res.status(500).json({ message: 'Error adding album', error });
        }
    }

    async listAlbums(req, res) {
        try {
            const albums = await this.albumModel.getAllAlbums();
            res.status(200).json(albums);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving albums', error });
        }
    }

    async getAlbum(req, res) {
        const { id } = req.params;
        try {
            const album = await this.albumModel.getAlbumById(id);
            if (album) {
                res.status(200).json(album);
            } else {
                res.status(404).json({ message: 'Album not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving album', error });
        }
    }

    async updateAlbum(req, res) {
        const { id } = req.params;
        const { bandName, albumTitle, numberOfSongs, releaseYear } = req.body;
        try {
            const updatedAlbum = await this.albumModel.updateAlbum(id, { bandName, albumTitle, numberOfSongs, releaseYear });
            if (updatedAlbum) {
                res.status(200).json(updatedAlbum);
            } else {
                res.status(404).json({ message: 'Album not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating album', error });
        }
    }

    async deleteAlbum(req, res) {
        const { id } = req.params;
        try {
            const deleted = await this.albumModel.deleteAlbum(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Album not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting album', error });
        }
    }
}

export default AlbumController;