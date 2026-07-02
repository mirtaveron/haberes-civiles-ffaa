CREATE TABLE IF NOT EXISTS asignacion_basica (
    nivel TEXT PRIMARY KEY,
    sueldo REAL,
    dedicacion REAL
);

CREATE TABLE IF NOT EXISTS grados (
    nivel TEXT PRIMARY KEY,
    g1 REAL, g2 REAL, g3 REAL, g4 REAL, g5 REAL,
    g6 REAL, g7 REAL, g8 REAL, g9 REAL, g10 REAL,
    g11 REAL, g12 REAL, g13 REAL, g14 REAL, g15 REAL
);

-- Migración segura para bases de datos existentes
ALTER TABLE grados ADD COLUMN IF NOT EXISTS g11 REAL;
ALTER TABLE grados ADD COLUMN IF NOT EXISTS g12 REAL;
ALTER TABLE grados ADD COLUMN IF NOT EXISTS g13 REAL;
ALTER TABLE grados ADD COLUMN IF NOT EXISTS g14 REAL;
ALTER TABLE grados ADD COLUMN IF NOT EXISTS g15 REAL;

CREATE TABLE IF NOT EXISTS tramos (
    nombre TEXT PRIMARY KEY,
    porcentaje REAL
);

CREATE TABLE IF NOT EXISTS jefaturas (
    nivel TEXT PRIMARY KEY,
    descripcion TEXT,
    ur REAL
);

CREATE TABLE IF NOT EXISTS capacitacion (
    nivel TEXT PRIMARY KEY,
    terciaria REAL,
    universitaria REAL
);

CREATE TABLE IF NOT EXISTS complemento (
    nivel TEXT PRIMARY KEY,
    ur REAL
);

CREATE TABLE IF NOT EXISTS configuracion (
    key TEXT PRIMARY KEY,
    value REAL
);

-- Insertar configuracion inicial
INSERT INTO configuracion (key, value) VALUES 
('valorUR', 366.92) 
ON CONFLICT DO NOTHING;

-- Insertar asignación básica
INSERT INTO asignacion_basica (nivel, sueldo, dedicacion) VALUES 
('1', 1200, 1951),
('2', 1009, 1640),
('3', 848, 1377),
('4', 713, 1158),
('5', 619, 1007),
('6', 529, 860),
('7', 461, 748),
('8', 400, 651)
ON CONFLICT DO NOTHING;

-- Insertar grados
INSERT INTO grados (nivel, g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13, g14, g15) VALUES 
('1', 316, 553, 855, 1180, 1534, 1688, 1806, 1932, 2067, 2212, 2357, 2502, 2647, 2792, 2937),
('2', 265, 464, 719, 991, 1289, 1418, 1517, 1623, 1738, 1859, 1980, 2101, 2222, 2343, 2464),
('3', 223, 390, 605, 833, 1084, 1191, 1276, 1365, 1460, 1562, 1664, 1766, 1868, 1970, 2072),
('4', 188, 327, 508, 700, 911, 1002, 1071, 1146, 1227, 1313, 1399, 1485, 1571, 1657, 1743),
('5', 163, 285, 442, 609, 792, 871, 931, 997, 1067, 1142, 1217, 1292, 1367, 1442, 1517),
('6', 139, 244, 377, 520, 677, 744, 796, 853, 912, 975, 1038, 1101, 1164, 1227, 1290),
('7', 122, 212, 329, 453, 588, 647, 692, 741, 793, 848, 903, 958, 1013, 1068, 1123),
('8', 106, 184, 286, 394, 512, 563, 602, 645, 690, 739, 788, 837, 886, 935, 984)
ON CONFLICT (nivel) DO UPDATE SET 
    g11 = COALESCE(grados.g11, EXCLUDED.g11),
    g12 = COALESCE(grados.g12, EXCLUDED.g12),
    g13 = COALESCE(grados.g13, EXCLUDED.g13),
    g14 = COALESCE(grados.g14, EXCLUDED.g14),
    g15 = COALESCE(grados.g15, EXCLUDED.g15);

-- Insertar tramos
INSERT INTO tramos (nombre, porcentaje) VALUES 
('Intermedio', 15),
('Avanzado', 30)
ON CONFLICT DO NOTHING;

-- Insertar jefaturas
INSERT INTO jefaturas (nivel, descripcion, ur) VALUES 
('I', 'Departamento', 737),
('II', 'División', 665),
('III', 'Sección', 617),
('IV', 'Supervisión', 551)
ON CONFLICT DO NOTHING;

-- Insertar capacitacion
INSERT INTO capacitacion (nivel, terciaria, universitaria) VALUES 
('1', 0, 1102.85),
('2', 0, 927.15),
('3', 333.75, 778.75),
('4', 280.65, 0),
('5', 243.90, 0),
('6', 0, 0),
('7', 0, 0),
('8', 0, 0)
ON CONFLICT DO NOTHING;

-- Insertar complemento
INSERT INTO complemento (nivel, ur) VALUES 
('1', 945.30),
('2', 794.70),
('3', 667.50),
('4', 561.30),
('5', 487.80),
('6', 416.70),
('7', 361.80),
('8', 315.30)
ON CONFLICT DO NOTHING;
