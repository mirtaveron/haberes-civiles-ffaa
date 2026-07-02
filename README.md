# Simulador de Haberes  

Este proyecto es una herramienta web interactiva diseñada para calcular y simular las liquidaciones salariales (haberes) del **personal civil de las Fuerzas Armadas**. 

Permite modificar parámetros dinámicos (nivel escalafonario, grado, tramo, suplementos) y visualiza de manera instantánea el impacto en el sueldo bruto, descuentos oficiales (Jubilación, Obra Social, Seguros) y el salario neto final. Cuenta con un panel de administración para actualizar las tablas base de forma centralizada en una base de datos PostgreSQL.

## 🏗️ Arquitectura del Proyecto (Monorepo)

El proyecto está dividido en dos partes independientes que se comunican a través de una API REST:

- **`frontend/`**: Aplicación web desarrollada con **React.js** y **Vite**. Renderiza la interfaz gráfica, maneja la lógica matemática del recibo en tiempo real y gestiona el Panel de Administración.
- **`backend/`**: Servidor desarrollado con **Node.js** y **Express**. Gestiona la conexión segura a la base de datos **PostgreSQL (Neon)** y provee endpoints (`/api/data`, `/api/update`) para leer y editar las tablas salariales.

## 🚀 Despliegue en la Nube (CI/CD)

El repositorio está configurado para un despliegue continuo (Continuous Deployment):
- **Backend**: Desplegado automáticamente en **Render** cuando se suben cambios a la rama `main`.
- **Frontend**: Desplegado automáticamente en **Vercel** cuando se suben cambios a la rama `main`.

---

*(Para más detalles técnicos sobre cómo ejecutar o configurar el servidor y la interfaz, consulta los archivos `README.md` dentro de las carpetas `frontend` y `backend`).*

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

---

¿Preguntas o problemas? Crea un *issue* en el repositorio o contacta al autor.
