const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Rutas de usuario
app.use('/api', userRoutes);

// Servidor corriendo en el puerto 5000
app.listen(5000, () => console.log("Servidor corriendo en el puerto 5000"));
