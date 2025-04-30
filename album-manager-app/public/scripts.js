document.addEventListener('DOMContentLoaded', () => {
    const albumForm = document.getElementById('album-form');
    const albumList = document.getElementById('album-list');
    const searchInput = document.getElementById('search-input');

    const fetchAlbums = async () => {
        const response = await fetch('/api/albums');
        const albums = await response.json();
        displayAlbums(albums);
    };

    const displayAlbums = (albums) => {
        albumList.innerHTML = '';
        albums.forEach(album => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${album.albumTitle}</strong> by ${album.bandName} 
                (${album.numberOfSongs} songs, released in ${album.releaseYear})
                <button onclick="editAlbum(${album.id})">Edit</button>
                <button onclick="deleteAlbum(${album.id})">Delete</button>
            `;
            albumList.appendChild(li);
        });
    };

    albumForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(albumForm);
        const albumData = Object.fromEntries(formData);
        
        await fetch('/api/albums', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(albumData),
        });
        albumForm.reset();
        fetchAlbums();
    });

    window.deleteAlbum = async (id) => {
        await fetch(`/api/albums/${id}`, {
            method: 'DELETE',
        });
        fetchAlbums();
    };

    window.editAlbum = async (id) => {
        const response = await fetch(`/api/albums/${id}`);
        const album = await response.json();
        albumForm['bandName'].value = album.bandName;
        albumForm['albumTitle'].value = album.albumTitle;
        albumForm['numberOfSongs'].value = album.numberOfSongs;
        albumForm['releaseYear'].value = album.releaseYear;
        albumForm.dataset.id = id;
    };

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.toLowerCase();
        const response = await fetch('/api/albums');
        const albums = await response.json();
        const filteredAlbums = albums.filter(album => 
            album.albumTitle.toLowerCase().includes(query) || 
            album.bandName.toLowerCase().includes(query)
        );
        displayAlbums(filteredAlbums);
    });

    fetchAlbums();
});