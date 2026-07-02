require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

async function initDb() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await client.query(sql);
    console.log("Base de datos PostgreSQL inicializada con exito desde init.sql.");
  } catch (err) {
    console.error("Error inicializando base de datos PostgreSQL:", err);
  } finally {
    client.release();
  }
}

// Inicializar DB al arrancar
initDb();

// ENDPOINTS API
app.get('/api/data', async (req, res) => {
    try {
        const data = {};
        const configRes = await pool.query("SELECT * FROM configuracion");
        data.configuracion = configRes.rows;
        
        const asigRes = await pool.query("SELECT * FROM asignacion_basica");
        data.asignacion_basica = asigRes.rows;
        
        const gradosRes = await pool.query("SELECT * FROM grados");
        data.grados = gradosRes.rows;
        
        const tramosRes = await pool.query("SELECT * FROM tramos");
        data.tramos = tramosRes.rows;
        
        const jefaturasRes = await pool.query("SELECT * FROM jefaturas");
        data.jefaturas = jefaturasRes.rows;
        
        const capRes = await pool.query("SELECT * FROM capacitacion");
        data.capacitacion = capRes.rows;
        
        const compRes = await pool.query("SELECT * FROM complemento");
        data.complemento = compRes.rows;
        
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
});

app.post('/api/update', async (req, res) => {
    const { table, keyField, key, field, value } = req.body;
    // Protección básica contra inyección (solo permitimos tablas validas)
    const allowedTables = ['asignacion_basica', 'grados', 'tramos', 'jefaturas', 'capacitacion', 'complemento', 'configuracion'];
    if (!allowedTables.includes(table)) return res.status(400).json({error: "Tabla no válida"});
    
    // Postgres injection protection: since table/fields cant be parameterized, we rely on the strictly controlled 'table' variable above.
    const query = `UPDATE ${table} SET ${field} = $1 WHERE ${keyField} = $2`;
    try {
        const result = await pool.query(query, [value, key]);
        res.json({ success: true, changes: result.rowCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend de Calculadora Sueldo corriendo en puerto ${PORT} conectado a Postgres`);
});
