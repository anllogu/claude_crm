# Patrones del Sistema

## Arquitectura General

El sistema CRM sigue una arquitectura moderna de aplicación web con separación clara entre frontend y backend:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Cliente   │ <──> │   Backend   │ <──> │ Base Datos  │
│  (Angular)  │      │  (FastAPI)  │      │   (SQLite)  │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Backend (FastAPI/Python)
- API RESTful que expone endpoints para todas las operaciones del CRM
- Organizado en módulos funcionales (auth, contacts, opportunities, etc.)
- Implementa autenticación y autorización para proteger recursos
- Gestiona la persistencia de datos mediante SQLAlchemy ORM

### Frontend (Angular)
- Aplicación SPA (Single Page Application) con Angular
- Arquitectura modular basada en características (feature-based)
- Utiliza Angular Material para componentes de UI consistentes
- Implementa lazy loading para optimizar el rendimiento

### Base de Datos
- SQLite para almacenamiento de datos
- Esquema relacional basado en el Common Data Model (CDM) de Microsoft
- Relaciones bien definidas entre entidades principales

## Relaciones entre Componentes

### Diagrama de Relaciones de Entidades

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │   Contact   │     │ Opportunity │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ username    │     │ first_name  │     │ contact_id  │◄─┐
│ email       │     │ last_name   │     │ user_id     │◄─┼─┐
│ password    │     │ email       │     │ name        │  │ │
│ ...         │     │ phone       │     │ value       │  │ │
└─────┬───────┘     │ company     │     │ status      │  │ │
      │             │ ...         │     │ ...         │  │ │
      │             └──────┬──────┘     └─────────────┘  │ │
      │                    │                             │ │
      │                    │       ┌─────────────┐       │ │
      │                    │       │ Interaction │       │ │
      │                    │       ├─────────────┤       │ │
      └────────────────────┼──────►│ user_id     │       │ │
                           │       │ contact_id  │◄──────┘ │
                           └──────►│ type        │         │
                                   │ notes       │         │
                                   │ ...         │         │
                                   └─────────────┘         │
                                                           │
                                   ┌─────────────┐         │
                                   │ Opportunity │         │
                                   │  Tracking   │         │
                                   ├─────────────┤         │
                                   │ id          │         │
                                   │ opportunity_│◄────────┘
                                   │ status      │
                                   │ notes       │
                                   │ ...         │
                                   └─────────────┘
```

## Flujo de Datos

### Autenticación y Autorización
1. El usuario envía credenciales al endpoint de login
2. El backend valida las credenciales y genera un token JWT
3. El cliente almacena el token y lo incluye en las cabeceras de solicitudes posteriores
4. El backend verifica el token en cada solicitud para autorizar el acceso

### Gestión de Contactos
1. El frontend solicita lista de contactos o detalles de un contacto específico
2. El backend consulta la base de datos y devuelve los datos solicitados
3. El usuario puede crear, editar o eliminar contactos a través de la interfaz
4. Las operaciones de escritura son validadas y persistidas en la base de datos

### Ciclo de Oportunidades
1. Las oportunidades están vinculadas a contactos específicos
2. Cada cambio de estado en una oportunidad genera un registro en la tabla de seguimiento
3. El sistema mantiene un historial completo de la evolución de cada oportunidad
4. Los datos agregados alimentan los KPIs y gráficos del dashboard

## Patrones de Diseño Utilizados

### Backend
- **Repository Pattern**: Abstracción de la capa de acceso a datos mediante servicios
- **Dependency Injection**: Inyección de dependencias para facilitar pruebas y mantenimiento
- **DTO Pattern**: Uso de schemas Pydantic para validación y serialización de datos
- **Middleware Pattern**: Para autenticación, logging y manejo de errores

### Frontend
- **Module Pattern**: Organización del código en módulos funcionales
- **Container/Presentational Components**: Separación de lógica y presentación
- **Service Pattern**: Servicios para encapsular la lógica de negocio y comunicación con API
- **Guard Pattern**: Protección de rutas basada en autenticación y roles
- **Interceptor Pattern**: Interceptores para manejo de tokens y errores HTTP

## Decisiones Arquitectónicas Clave

1. **Separación Frontend/Backend**: Permite desarrollo independiente y escalabilidad de cada componente.

2. **API RESTful**: Interfaz clara y estándar para la comunicación entre frontend y backend.

3. **Autenticación basada en JWT**: Proporciona un mecanismo stateless para autenticación y autorización.

4. **Arquitectura Modular**: Tanto en frontend como backend, facilita mantenimiento y extensibilidad.

5. **ORM para Acceso a Datos**: Abstracción de la base de datos que simplifica operaciones y migración potencial.

6. **Lazy Loading en Frontend**: Mejora el rendimiento inicial cargando módulos bajo demanda.

7. **Modelo de Datos Relacional**: Estructura clara con relaciones bien definidas entre entidades.

8. **Validación en Múltiples Capas**: Validación tanto en frontend como backend para garantizar integridad.

## Rutas Críticas de Implementación

1. **Flujo de Autenticación**: Fundamental para la seguridad del sistema.
   - Login/registro de usuarios
   - Generación y validación de tokens
   - Protección de rutas y recursos

2. **Gestión del Estado de Oportunidades**: Central para la funcionalidad de seguimiento de ventas.
   - Transiciones entre estados
   - Registro histórico de cambios
   - Cálculo de métricas derivadas

3. **Dashboard y Análisis**: Esencial para proporcionar valor a través de insights.
   - Agregación de datos de múltiples fuentes
   - Cálculo de KPIs en tiempo real
   - Visualización efectiva de métricas clave
