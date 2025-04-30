const express = require('express');
const AlbumController = require('../controllers/albumController');

const setAlbumRoutes = (app) => {
    const albumController = new AlbumController();

    app.post('/albums', albumController.addAlbum.bind(albumController));
    app.get('/albums', albumController.listAlbums.bind(albumController));
    app.get('/albums/:id', albumController.getAlbum.bind(albumController));
    app.put('/albums/:id', albumController.updateAlbum.bind(albumController));
    app.delete('/albums/:id', albumController.deleteAlbum.bind(albumController));
};

module.exports = setAlbumRoutes;