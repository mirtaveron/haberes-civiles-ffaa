require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

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
    // Create tables
    await client.query(`CREATE TABLE IF NOT EXISTS asignacion_basica (
        nivel TEXT PRIMARY KEY,
        sueldo REAL,
        dedicacion REAL
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS grados (
        nivel TEXT PRIMARY KEY,
        g1 REAL, g2 REAL, g3 REAL, g4 REAL, g5 REAL,
        g6 REAL, g7 REAL, g8 REAL, g9 REAL, g10 REAL
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS tramos (
        nombre TEXT PRIMARY KEY,
        porcentaje REAL
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS jefaturas (
        nivel TEXT PRIMARY KEY,
        descripcion TEXT,
        ur REAL
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS capacitacion (
        nivel TEXT PRIMARY KEY,
        terciaria REAL,
        universitaria REAL
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS complemento (
        nivel TEXT PRIMARY KEY,
        ur REAL
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS configuracion (
        key TEXT PRIMARY KEY,
        value REAL
    )`);

    // Insertar configuracion inicial si no existe
    const configRes = await client.query(`SELECT count(*) as count FROM configuracion`);
    if (parseInt(configRes.rows[0].count) === 0) {
        await client.query(`INSERT INTO configuracion (key, value) VALUES ('valorUR', 366.92)`);
    }

    // Insertar asignación básica si no existe
    const asigRes = await client.query(`SELECT count(*) as count FROM asignacion_basica`);
    if (parseInt(asigRes.rows[0].count) === 0) {
        const insertAsig = `INSERT INTO asignacion_basica (nivel, sueldo, dedicacion) VALUES ($1, $2, $3)`;
        await client.query(insertAsig, ['1', 1200, 1951]);
        await client.query(insertAsig, ['2', 1009, 1640]);
        await client.query(insertAsig, ['3', 848, 1377]);
        await client.query(insertAsig, ['4', 713, 1158]);
        await client.query(insertAsig, ['5', 619, 1007]);
        await client.query(insertAsig, ['6', 529, 860]);
        await client.query(insertAsig, ['7', 461, 748]);
        await client.query(insertAsig, ['8', 400, 651]);
    }

    // Insertar grados si no existen
    const gradosRes = await client.query(`SELECT count(*) as count FROM grados`);
    if (parseInt(gradosRes.rows[0].count) === 0) {
        const insertGrados = `INSERT INTO grados (nivel, g1, g2, g3, g4, g5, g6, g7, g8, g9, g10) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
        await client.query(insertGrados, ['1', 316, 553, 855, 1180, 1534, 1688, 1806, 1932, 2067, 2212]);
        await client.query(insertGrados, ['2', 265, 464, 719, 991, 1289, 1418, 1517, 1623, 1738, 1859]);
        await client.query(insertGrados, ['3', 223, 390, 605, 833, 1084, 1191, 1276, 1365, 1460, 1562]);
        await client.query(insertGrados, ['4', 188, 327, 508, 700, 911, 1002, 1071, 1146, 1227, 1313]);
        await client.query(insertGrados, ['5', 163, 285, 442, 609, 792, 871, 931, 997, 1067, 1142]);
        await client.query(insertGrados, ['6', 139, 244, 377, 520, 677, 744, 796, 853, 912, 975]);
        await client.query(insertGrados, ['7', 122, 212, 329, 453, 588, 647, 692, 741, 793, 848]);
        await client.query(insertGrados, ['8', 106, 184, 286, 394, 512, 563, 602, 645, 690, 739]);
    }

    // Insertar tramos si no existen
    const tramosRes = await client.query(`SELECT count(*) as count FROM tramos`);
    if (parseInt(tramosRes.rows[0].count) === 0) {
        await client.query(`INSERT INTO tramos (nombre, porcentaje) VALUES ('Intermedio', 15)`);
        await client.query(`INSERT INTO tramos (nombre, porcentaje) VALUES ('Avanzado', 30)`);
    }

    // Insertar jefaturas si no existen
    const jefaturasRes = await client.query(`SELECT count(*) as count FROM jefaturas`);
    if (parseInt(jefaturasRes.rows[0].count) === 0) {
        await client.query(`INSERT INTO jefaturas (nivel, descripcion, ur) VALUES ('I', 'Departamento', 737)`);
        await client.query(`INSERT INTO jefaturas (nivel, descripcion, ur) VALUES ('II', 'División', 665)`);
        await client.query(`INSERT INTO jefaturas (nivel, descripcion, ur) VALUES ('III', 'Sección', 617)`);
        await client.query(`INSERT INTO jefaturas (nivel, descripcion, ur) VALUES ('IV', 'Supervisión', 551)`);
    }

    // Insertar capacitacion si no existen
    const capRes = await client.query(`SELECT count(*) as count FROM capacitacion`);
    if (parseInt(capRes.rows[0].count) === 0) {
        const insertCap = `INSERT INTO capacitacion (nivel, terciaria, universitaria) VALUES ($1, $2, $3)`;
        await client.query(insertCap, ['1', 0, 1102.85]);
        await client.query(insertCap, ['2', 0, 927.15]);
        await client.query(insertCap, ['3', 333.75, 778.75]);
        await client.query(insertCap, ['4', 280.65, 0]);
        await client.query(insertCap, ['5', 243.90, 0]);
        await client.query(insertCap, ['6', 0, 0]);
        await client.query(insertCap, ['7', 0, 0]);
        await client.query(insertCap, ['8', 0, 0]);
    }

    // Insertar complemento si no existen
    const compRes = await client.query(`SELECT count(*) as count FROM complemento`);
    if (parseInt(compRes.rows[0].count) === 0) {
        const insertComp = `INSERT INTO complemento (nivel, ur) VALUES ($1, $2)`;
        await client.query(insertComp, ['1', 945.30]);
        await client.query(insertComp, ['2', 794.70]);
        await client.query(insertComp, ['3', 667.50]);
        await client.query(insertComp, ['4', 561.30]);
        await client.query(insertComp, ['5', 487.80]);
        await client.query(insertComp, ['6', 416.70]);
        await client.query(insertComp, ['7', 361.80]);
        await client.query(insertComp, ['8', 315.30]);
    }

    console.log("Base de datos PostgreSQL inicializada con exito.");
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
