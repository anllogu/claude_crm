# Contexto Tecnológico

## Stack Tecnológico

### Backend
- **Lenguaje**: Python 3.8+
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Validación de Datos**: Pydantic
- **Autenticación**: JWT (JSON Web Tokens)
- **Base de Datos**: SQLite

### Frontend
- **Framework**: Angular
- **Lenguaje**: TypeScript
- **UI Components**: Angular Material
- **Estilos**: SCSS
- **Gestión de Estado**: Servicios Angular y RxJS
- **Routing**: Angular Router con lazy loading
- **Build Tool**: Vite

## Dependencias Principales

### Backend (Python)
- **fastapi**: Framework web de alto rendimiento
- **uvicorn**: Servidor ASGI para ejecutar la aplicación
- **sqlalchemy**: ORM para interacción con base de datos
- **pydantic**: Validación de datos y serialización
- **python-jose**: Implementación de JWT para autenticación
- **passlib**: Gestión de hashing de contraseñas
- **python-multipart**: Soporte para formularios multipart

### Frontend (Angular)
- **@angular/core**: Framework base de Angular
- **@angular/material**: Componentes UI de Material Design
- **@angular/forms**: Manejo de formularios reactivos
- **rxjs**: Programación reactiva
- **typescript**: Lenguaje tipado que compila a JavaScript
- **vite**: Herramienta de construcción rápida

## Estructura de Directorios

### Estructura General
```
/
├── backend/               # Código del servidor API
│   ├── app/               # Código principal de la aplicación
│   │   ├── auth/          # Autenticación y autorización
│   │   ├── models/        # Modelos de datos SQLAlchemy
│   │   ├── routes/        # Endpoints de la API
│   │   ├── schemas/       # Schemas Pydantic para validación
│   │   └── services/      # Servicios y lógica de negocio
│   ├── requirements.txt   # Dependencias Python
│   └── run.py             # Punto de entrada de la aplicación
│
└── frontend/              # Aplicación cliente Angular
    └── crm-app/           # Proyecto Angular
        ├── src/           # Código fuente
        │   ├── app/       # Componentes y lógica de la aplicación
        │   │   ├── core/      # Servicios, modelos y guardias core
        │   │   ├── features/  # Módulos de características
        │   │   └── shared/    # Componentes compartidos
        │   └── environments/  # Configuraciones por entorno
        ├── package.json   # Dependencias y scripts npm
        └── angular.json   # Configuración de Angular
```

### Estructura Detallada del Backend
```
backend/app/
├── auth/                  # Autenticación
│   ├── __init__.py
│   └── utils.py           # Utilidades de autenticación
├── models/                # Modelos de datos
│   ├── __init__.py
│   ├── contact.py         # Modelo de contactos
│   ├── interaction.py     # Modelo de interacciones
│   ├── opportunity.py     # Modelo de oportunidades
│   ├── opportunity_tracking.py  # Seguimiento de oportunidades
│   └── user.py            # Modelo de usuarios
├── routes/                # Endpoints API
│   ├── __init__.py
│   ├── auth.py            # Rutas de autenticación
│   ├── contacts.py        # Rutas de contactos
│   ├── dashboard.py       # Rutas del dashboard
│   ├── interactions.py    # Rutas de interacciones
│   ├── opportunities.py   # Rutas de oportunidades
│   └── users.py           # Rutas de usuarios
├── schemas/               # Schemas de validación
│   ├── __init__.py
│   ├── contact.py
│   ├── interaction.py
│   ├── opportunity.py
│   ├── opportunity_tracking.py
│   └── user.py
└── services/              # Servicios de negocio
```

### Estructura Detallada del Frontend
```
frontend/crm-app/src/app/
├── core/                  # Funcionalidad central
│   ├── guards/            # Guardias de rutas
│   │   ├── admin.guard.ts
│   │   └── auth.guard.ts
│   ├── interceptors/      # Interceptores HTTP
│   │   └── auth.interceptor.ts
│   ├── models/            # Interfaces de datos
│   │   ├── contact.model.ts
│   │   ├── dashboard.model.ts
│   │   ├── interaction.model.ts
│   │   ├── opportunity-tracking.model.ts
│   │   ├── opportunity.model.ts
│   │   └── user.model.ts
│   └── services/          # Servicios de comunicación con API
│       ├── api-config.service.ts
│       ├── auth.service.ts
│       ├── contacts.service.ts
│       ├── dashboard.service.ts
│       ├── interactions.service.ts
│       └── opportunities.service.ts
├── features/              # Módulos de características
│   ├── auth/              # Autenticación
│   │   ├── login/
│   │   └── register/
│   ├── contacts/          # Gestión de contactos
│   │   ├── contact-form/
│   │   └── contacts-list/
│   ├── dashboard/         # Dashboard principal
│   ├── opportunities/     # Gestión de oportunidades
│   │   ├── opportunities-list/
│   │   ├── opportunity-dashboard/
│   │   ├── opportunity-form/
│   │   └── opportunity-progress-bar/
│   └── settings/          # Configuración del sistema
│       └── users/         # Gestión de usuarios
└── shared/                # Componentes compartidos
    └── layout/            # Layout principal de la aplicación
```

## Entorno de Desarrollo

### Requisitos
- Python 3.8+
- Node.js 14+
- npm 6+
- Editor recomendado: Visual Studio Code con extensiones para Python, TypeScript y Angular

### Configuración Inicial
1. Clonar el repositorio
2. Configurar el entorno Python:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Configurar el entorno Node.js:
   ```bash
   cd frontend/crm-app
   npm install
   ```

### Comandos de Ejecución

#### Backend
```bash
cd backend
python run.py
```
El servidor API estará disponible en `http://localhost:8000`.
La documentación de la API estará disponible en `http://localhost:8000/docs`.

#### Frontend
```bash
cd frontend/crm-app
ng serve
```
La aplicación estará disponible en `http://localhost:4200`.

## Patrones de Uso de Herramientas

### Gestión de Base de Datos
- SQLite como base de datos por su simplicidad y portabilidad
- SQLAlchemy ORM para abstraer operaciones de base de datos
- Migraciones manuales mediante scripts Python

### Autenticación y Seguridad
- JWT para autenticación stateless
- Hashing de contraseñas con algoritmos seguros
- Guards en Angular para protección de rutas
- Interceptor HTTP para incluir token en solicitudes

### Desarrollo Frontend
- Arquitectura modular con lazy loading
- Componentes reutilizables en módulo shared
- Servicios para encapsular lógica de comunicación con API
- Formularios reactivos para validación en tiempo real

### API Backend
- Endpoints RESTful organizados por dominio
- Validación de datos con Pydantic
- Documentación automática con Swagger/OpenAPI
- Manejo centralizado de errores

## Restricciones Técnicas

1. **Base de Datos**: SQLite, adecuada para desarrollo pero con limitaciones para producción a gran escala.

2. **Autenticación**: Sistema básico JWT sin refresh tokens o revocación.

3. **Escalabilidad**: Diseño monolítico que podría requerir refactorización para escalar horizontalmente.

4. **Offline**: No hay soporte para operaciones offline en el frontend.

5. **Internacionalización**: No implementada inicialmente, requeriría trabajo adicional.

## Consideraciones para Evolución Futura

1. **Migración de Base de Datos**: Posible migración a PostgreSQL o MySQL para entornos de producción.

2. **Autenticación Avanzada**: Implementar refresh tokens, revocación y autenticación de dos factores.

3. **Contenedorización**: Dockerizar la aplicación para facilitar despliegue y escalabilidad.

4. **Testing Automatizado**: Ampliar cobertura de pruebas unitarias e integración.

5. **CI/CD**: Implementar pipeline de integración y despliegue continuo.

6. **Microservicios**: Evaluar la posibilidad de migrar a una arquitectura de microservicios para componentes específicos.
