import sqlite3
import random

NOMBRES = ["Juan", "Ana", "Luis", "Marta", "Carlos", "Lucía", "Pedro", "Sofía"]
APELLIDOS = ["García", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Díaz", "Fernández"]

conn = sqlite3.connect("app/../crm.db")
c = conn.cursor()

# Añadir columnas si no existen
def add_column_if_not_exists(table, column, coltype):
    c.execute(f"PRAGMA table_info({table})")
    columns = [info[1] for info in c.fetchall()]
    if column not in columns:
        c.execute(f"ALTER TABLE {table} ADD COLUMN {column} {coltype}")

add_column_if_not_exists("users", "nombre", "TEXT NOT NULL DEFAULT ''")
add_column_if_not_exists("users", "apellidos", "TEXT NOT NULL DEFAULT ''")
add_column_if_not_exists("users", "rol", "TEXT NOT NULL DEFAULT 'usuario'")

# Rellenar valores aleatorios donde estén vacíos
def random_name():
    return random.choice(NOMBRES)
def random_apellido():
    return random.choice(APELLIDOS)

c.execute("SELECT id, nombre, apellidos, rol FROM users")
users = c.fetchall()
for user in users:
    id_, nombre, apellidos, rol = user
    update_needed = False
    if not nombre:
        nombre = random_name()
        update_needed = True
    if not apellidos:
        apellidos = random_apellido()
        update_needed = True
    if not rol:
        rol = "usuario"
        update_needed = True
    if update_needed:
        c.execute("UPDATE users SET nombre=?, apellidos=?, rol=? WHERE id=?", (nombre, apellidos, rol, id_))

conn.commit()
conn.close()
