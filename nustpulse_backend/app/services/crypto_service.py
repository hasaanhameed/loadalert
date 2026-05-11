from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

load_dotenv()

# Get the key from environment
FERNET_KEY = os.getenv("FERNET_KEY")
if not FERNET_KEY:
    raise ValueError("FERNET_KEY not found in environment variables")

cipher_suite = Fernet(FERNET_KEY.encode())

def encrypt_password(password: str) -> str:
    """Scrambles a password into gibberish."""
    return cipher_suite.encrypt(password.encode()).decode()

def decrypt_password(encrypted_password: str) -> str:
    """Unscrambles gibberish back into the original password."""
    return cipher_suite.decrypt(encrypted_password.encode()).decode()
