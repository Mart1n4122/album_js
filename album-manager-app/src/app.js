const express = require('express');
const bodyParser = require('body-parser');
const albumRoutes = require('./routes/albumRoutes');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

db.initialize();

app.use('/api/albums', albumRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});