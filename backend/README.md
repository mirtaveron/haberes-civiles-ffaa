# Simulador de Haberes - Backend

Esta carpeta contiene el servidor API REST construido con **Node.js** y **Express**. Su objetivo es persistir y proveer las tablas de asignaciones, grados, U.R. y configuraciones.

## 🛠️ Tecnologías

- **Node.js & Express**: Framework web para la API.
- **PostgreSQL (pg)**: Driver oficial de Postgres para Node.
- **Neon.tech**: Base de datos Serverless Postgres en la nube.
- **Cors & Dotenv**: Middleware para seguridad y variables de entorno.

## ⚙️ Configuración (Variables de Entorno)

Crea un archivo `.env` tomando como guía `.env.example`:
```
PORT=3001
DATABASE_URL=postgresql://usuario:password@host/neondb?sslmode=require
```

## 🗄️ Base de Datos Automática

El servidor cuenta con una función de inicialización (`initDb`) que se ejecuta cada vez que arranca. Si las tablas no existen, las crea automáticamente (`CREATE TABLE IF NOT EXISTS`) e inserta los valores base. **No es necesario inicializar la base de datos de forma manual.**

### Usar una Base de Datos Local (Opcional)

Si deseas trabajar sin conexión a internet o no quieres usar Neon.tech, puedes levantar un PostgreSQL local:

**Opción A (Docker - Recomendado):**
```bash
docker run --name postgres-local -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=simulador -p 5432:5432 -d postgres
```
Y luego en tu archivo `.env` configuras:
`DATABASE_URL=postgresql://postgres:admin@localhost:5432/simulador`

**Opción B (Instalación nativa):**
1. Descarga e instala PostgreSQL para Windows.
2. Crea una base de datos llamada `simulador` usando pgAdmin.
3. Cambia tu `DATABASE_URL` en el `.env` con tus credenciales locales.

*¡Recuerda! Al iniciar `node server.js`, tu servidor construirá las tablas automáticamente en esta nueva base de datos local vacía.*

## 🏃‍♂️ Desarrollo Local

Para correr el servidor API en tu computadora:

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor:
   ```bash
   node server.js
   ```
3. La API estará disponible en `http://localhost:3001/api/data`.
