import sys
import os
import random
from datetime import datetime, timedelta
import sqlite3

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Connect to the SQLite database
conn = sqlite3.connect('backend/crm.db')
cursor = conn.cursor()

# Sample data for contacts
contacts_data = [
    {
        "first_name": "María", 
        "last_name": "González", 
        "email": "maria.gonzalez@example.com", 
        "phone": "+34 612 345 678", 
        "company": "Tecnologías Innovadoras S.L.", 
        "position": "Directora de Marketing"
    },
    {
        "first_name": "Carlos", 
        "last_name": "Rodríguez", 
        "email": "carlos.rodriguez@example.com", 
        "phone": "+34 623 456 789", 
        "company": "Soluciones Digitales S.A.", 
        "position": "CEO"
    },
    {
        "first_name": "Ana", 
        "last_name": "Martínez", 
        "email": "ana.martinez@example.com", 
        "phone": "+34 634 567 890", 
        "company": "Consultora Estratégica", 
        "position": "Directora de Operaciones"
    },
    {
        "first_name": "Javier", 
        "last_name": "López", 
        "email": "javier.lopez@example.com", 
        "phone": "+34 645 678 901", 
        "company": "Desarrollos Web Premium", 
        "position": "CTO"
    },
    {
        "first_name": "Elena", 
        "last_name": "Sánchez", 
        "email": "elena.sanchez@example.com", 
        "phone": "+34 656 789 012", 
        "company": "Marketing Digital Plus", 
        "position": "Directora Comercial"
    }
]

# Non-closed opportunity statuses
opportunity_statuses = [
    "Identificada",
    "Calificada",
    "Propuesta",
    "Decisión"
]

# Opportunity names and descriptions
opportunity_types = [
    {
        "name": "Implementación CRM",
        "description": "Implementación de sistema CRM personalizado para mejorar la gestión de clientes."
    },
    {
        "name": "Desarrollo Web",
        "description": "Desarrollo de sitio web corporativo con funcionalidades avanzadas."
    },
    {
        "name": "Consultoría Estratégica",
        "description": "Servicio de consultoría para optimizar procesos de negocio."
    },
    {
        "name": "Marketing Digital",
        "description": "Campaña de marketing digital para aumentar visibilidad online."
    },
    {
        "name": "Integración de Sistemas",
        "description": "Integración de sistemas existentes con nuevas plataformas."
    },
    {
        "name": "Automatización de Procesos",
        "description": "Implementación de soluciones para automatizar procesos manuales."
    },
    {
        "name": "Análisis de Datos",
        "description": "Servicio de análisis de datos para mejorar la toma de decisiones."
    },
    {
        "name": "Soporte Técnico Premium",
        "description": "Contrato de soporte técnico con atención prioritaria."
    }
]

# Function to generate a random date between January and April 2025
def random_date_2025():
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 4, 30)
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    return start_date + timedelta(days=random_days)

# Insert contacts
contact_ids = []
for contact in contacts_data:
    created_at = random_date_2025().strftime('%Y-%m-%d %H:%M:%S')
    
    cursor.execute('''
        INSERT INTO contacts (first_name, last_name, email, phone, company, position, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        contact["first_name"],
        contact["last_name"],
        contact["email"],
        contact["phone"],
        contact["company"],
        contact["position"],
        created_at,
        created_at
    ))
    
    contact_ids.append(cursor.lastrowid)
    print(f"Added contact: {contact['first_name']} {contact['last_name']}")

# Insert opportunities (4 per contact)
for contact_id in contact_ids:
    for i in range(4):
        created_at = random_date_2025().strftime('%Y-%m-%d %H:%M:%S')
        expected_close_date = (datetime.strptime(created_at, '%Y-%m-%d %H:%M:%S') + timedelta(days=random.randint(30, 90))).strftime('%Y-%m-%d %H:%M:%S')
        
        opportunity = random.choice(opportunity_types)
        status = random.choice(opportunity_statuses)
        value = round(random.uniform(5000, 50000), 2)
        
        cursor.execute('''
            INSERT INTO opportunities (contact_id, user_id, name, description, value, status, expected_close_date, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            contact_id,
            1,  # Using the existing user with ID 1
            opportunity["name"],
            opportunity["description"],
            value,
            status,
            expected_close_date,
            created_at,
            created_at
        ))
        
        print(f"Added opportunity: {opportunity['name']} for contact ID {contact_id}")

# Commit the changes and close the connection
conn.commit()
conn.close()

print("\nTest data generation complete!")
print("Added 5 contacts and 20 opportunities (4 per contact)")
