# CRM System

Este es un sistema CRM básico desarrollado con Python/FastAPI para el backend y Angular para el frontend.

## Características

- Gestión de Contactos: Almacena información de clientes actuales y potenciales, incluyendo datos de contacto, historial de interacciones y preferencias.
- Seguimiento de Oportunidades: Permite gestionar el ciclo de ventas, desde la identificación de oportunidades hasta su cierre.
- KPIs y Gráficos: Dashboard principal con el número de clientes actuales, y el número de oportunidades abiertas y ganadas.

## Stack Tecnológico

- Backend: Python con FastAPI
- Frontend: Angular con Material Design
- Base de Datos: SQLite

## Estructura del Proyecto

El proyecto está organizado en dos carpetas principales:

- `backend/`: Contiene el código del servidor API desarrollado con FastAPI
- `frontend/`: Contiene la aplicación cliente desarrollada con Angular

## Requisitos

- Python 3.8+
- Node.js 14+
- npm 6+

## Instalación y Ejecución

### Backend

1. Navega a la carpeta del backend:
   ```
   cd backend
   ```

2. Instala las dependencias:
   ```
   pip install -r requirements.txt
   ```

3. Ejecuta el servidor:
   ```
   python run.py
   ```

El servidor API estará disponible en `http://localhost:8000`.

### Frontend

1. Navega a la carpeta del frontend:
   ```
   cd frontend/crm-app
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Ejecuta la aplicación:
   ```
   ng serve
   ```

La aplicación estará disponible en `http://localhost:4200`.

## Uso

1. Abre tu navegador y ve a `http://localhost:4200`
2. Regístrate con un nuevo usuario
3. Inicia sesión con tus credenciales
4. Explora las diferentes secciones del CRM

## Modelo de Datos

El modelo de datos está basado en el Common Data Model (CDM) de Microsoft, lo que facilita la ampliación con nuevas funcionalidades en el futuro.

## API Endpoints

La documentación de la API está disponible en `http://localhost:8000/docs` una vez que el servidor está en ejecución.
