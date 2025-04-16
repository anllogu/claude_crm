from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth_router, contacts_router, interactions_router, opportunities_router, dashboard_router
from .routes import users as users_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CRM API",
    description="API for CRM system",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(contacts_router)
app.include_router(interactions_router)
app.include_router(opportunities_router)
app.include_router(dashboard_router)
app.include_router(users_router.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the CRM API"}
