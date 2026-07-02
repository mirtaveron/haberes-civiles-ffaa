# Simulador de Haberes - Frontend

Esta carpeta contiene la aplicación web desarrollada con **React** y construida con **Vite**.

## 🛠️ Tecnologías

- **React.js**: Biblioteca principal de interfaces.
- **Vite**: Herramienta de compilación ultrarrápida.
- **Axios**: Cliente HTTP para comunicarse con el Backend.
- **Lucide-React**: Biblioteca de íconos SVG de alta calidad.
- **CSS3 Nativo**: Estilos personalizados con variables CSS.

## ⚙️ Configuración (Variables de Entorno)

Crea un archivo `.env` tomando como guía `.env.example`:
```
VITE_API_URL=http://localhost:3001/api
```
*(En Vercel, esta variable apunta a la URL pública del backend en Render).*

## 🏃‍♂️ Desarrollo Local

Para correr la interfaz de usuario en tu computadora:

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor de desarrollo (con recarga en caliente):
   ```bash
   npm run dev
   ```
3. Abre el navegador en `http://localhost:5173` (o el puerto que te indique Vite).
