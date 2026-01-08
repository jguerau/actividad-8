

const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'blog_db'
};

let pool;

// Inicializar conexión
async function initDb() {
    pool = mysql.createPool(dbConfig);
    console.log('Conectado a MySQL');
}

// --- RUTAS DE LA API ---

// 1. Obtener todos los autores
app.get('/api/autores', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM autores');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Crear un autor
app.post('/api/autores', async (req, res) => {
    const { nombre, email, imagen } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO autores (nombre, email, imagen) VALUES (?, ?, ?)',
            [nombre, email, imagen]
        );
        res.status(201).json({ id: result.insertId, nombre, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Obtener todos los posts (con datos del autor)
app.get('/api/posts', async (req, res) => {
    try {
        const query = `
            SELECT p.*, a.nombre as autor_nombre, a.email as autor_email, a.imagen as autor_imagen
            FROM posts p
            JOIN autores a ON p.autor_id = a.id
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Crear un post
app.post('/api/posts', async (req, res) => {
    const { titulo, descripcion, categoria, autor_id } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO posts (titulo, descripcion, categoria, autor_id) VALUES (?, ?, ?, ?)',
            [titulo, descripcion, categoria, autor_id]
        );
        res.status(201).json({ id: result.insertId, titulo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Obtener posts de un autor específico
app.get('/api/autores/:autorId/posts', async (req, res) => {
    const { autorId } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM posts WHERE autor_id = ?', [autorId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await initDb();
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});