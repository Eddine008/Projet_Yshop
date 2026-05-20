const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/ishop'); 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); 

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Serveur démarré `);
});