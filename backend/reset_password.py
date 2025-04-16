import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from backend.app.database import SessionLocal
from backend.app.auth.utils import get_password_hash
from backend.app.models.user import User

def reset_password(username: str, new_password: str):
    db = SessionLocal()
    user = db.query(User).filter(User.username == username).first()
    if not user:
        print(f"User '{username}' not found.")
        return
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    print(f"Password reset successfully for user '{username}'.")

if __name__ == "__main__":
    reset_password("anllogui", "anllogui")
