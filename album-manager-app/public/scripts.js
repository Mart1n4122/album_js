const baseUrl = 'http://localhost:3000';
const albumsContainer = document.getElementById('albums-container');
const addAlbumBtn = document.getElementById('add-album-btn');
const albumModal = document.getElementById('album-modal');
const albumForm = document.getElementById('album-form');
const modalTitle = document.getElementById('modal-title');
const cancelBtn = document.getElementById('cancel-btn');
const searchBar = document.getElementById('search-bar');

let albums = [];
let editAlbumId = null;

async function fetchAlbums() {
    try {
        const response = await fetch(`${baseUrl}/albums`);
        if (!response.ok) throw new Error('Failed to fetch albums');
        albums = await response.json();
        renderAlbums();
    } catch (error) {
        console.error('Error fetching albums:', error);
    }
}

function renderAlbums(filteredAlbums = albums) {
    albumsContainer.innerHTML = '';
    filteredAlbums.forEach(album => {
        const albumCard = document.createElement('div');
        albumCard.classList.add('album-card');
        albumCard.innerHTML = `
            <h3>${album.title}</h3>
            <p><strong>Artist:</strong> ${album.band}</p>
            <p><strong>Duration:</strong> ${album.totalLength}</p>
            <p><strong>Track Count:</strong> ${album.songCount}</p>
            <div class="card-actions">
                <button class="edit-btn" data-id="${album.id}">Edit</button>
                <button class="delete-btn" data-id="${album.id}">Delete</button>
            </div>
        `;
        albumsContainer.appendChild(albumCard);
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', handleEditAlbum);
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteAlbum);
    });
}

function handleAddAlbum() {
    editAlbumId = null;
    modalTitle.textContent = 'Add Album';
    albumForm.reset();
    albumModal.classList.remove('hidden');
}

function handleEditAlbum(event) {
    const id = event.target.dataset.id;
    const album = albums.find(album => album.id == id);
    if (!album) return;

    editAlbumId = id;
    modalTitle.textContent = 'Edit Album';
    albumForm.artist.value = album.band;
    albumForm.title.value = album.title;
    albumForm.duration.value = album.totalLength;
    albumForm.trackCount.value = album.songCount;
    albumModal.classList.remove('hidden');
}

async function handleDeleteAlbum(event) {
    const id = event.target.dataset.id;
    try {
        await fetch(`${baseUrl}/albums/${id}`, { method: 'DELETE' });
        fetchAlbums();
    } catch (error) {
        console.error('Error deleting album:', error);
    }
}

albumForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const albumData = {
        band: albumForm.artist.value,
        title: albumForm.title.value,
        totalLength: albumForm.duration.value,
        songCount: parseInt(albumForm.trackCount.value, 10),
        songs: []
    };

    try {
        if (editAlbumId) {
            await fetch(`${baseUrl}/albums/${editAlbumId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(albumData),
            });
        } else {
            await fetch(`${baseUrl}/albums`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(albumData),
            });
        }

        albumModal.classList.add('hidden');
        fetchAlbums();
    } catch (error) {
        console.error('Error saving album:', error);
    }
});

cancelBtn.addEventListener('click', () => {
    albumModal.classList.add('hidden');
});

searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    const filteredAlbums = albums.filter(album =>
        album.title.toLowerCase().includes(query) ||
        album.band.toLowerCase().includes(query)
    );
    renderAlbums(filteredAlbums);
});

addAlbumBtn.addEventListener('click', handleAddAlbum);
fetchAlbums();