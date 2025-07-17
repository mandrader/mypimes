const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const catalogoRoutes = require('./routes/catalogo');

dotenv.config();

const app = express();

// Activar CORS
app.use(cors());

// Middleware para JSON
app.use(express.json());

// Rutas principales
app.use('/v1', catalogoRoutes);

// Servidor en marcha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});