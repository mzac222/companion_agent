import sqlite3
from datetime import datetime
import threading
import logging

logger = logging.getLogger(__name__)

# Thread-local storage for database connections
local_storage = threading.local()

def get_db_connection():
    """Get a thread-local database connection"""
    if not hasattr(local_storage, 'connection'):
        local_storage.connection = sqlite3.connect(
            "chat_history.db",
            check_same_thread=False,  # Required for multi-threaded use
            timeout=10  # Wait up to 10 seconds if database is locked
        )
        local_storage.connection.row_factory = sqlite3.Row
    return local_storage.connection

def setup_database():
    """Initialize the database schema"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS chat_history (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            timestamp TEXT,
                            user_query TEXT,
                            bot_response TEXT
                        )''')
        conn.commit()
        logger.info("Database setup completed successfully")
    except Exception as e:
        logger.error(f"Error setting up database: {str(e)}")
        raise

def save_chat_to_db(user_query: str, bot_response: str):
    """Save a chat message to the database"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute(
            "INSERT INTO chat_history (timestamp, user_query, bot_response) VALUES (?, ?, ?)",
            (timestamp, user_query, bot_response)
        )
        conn.commit()
        logger.debug(f"Saved message to DB: {user_query[:50]}...")
    except Exception as e:
        logger.error(f"Error saving to database: {str(e)}")
        raise

def get_chat_history() -> list:
    """Retrieve all chat history from the database"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""SELECT id, timestamp, user_query, bot_response 
                          FROM chat_history 
                          ORDER BY timestamp DESC 
                          LIMIT 100""")
        return [
            {
                "id": row["id"],
                "timestamp": row["timestamp"],
                "user_query": row["user_query"],
                "bot_response": row["bot_response"]
            }
            for row in cursor.fetchall()
        ]
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        raise

def get_chat_by_id(chat_id: int) -> dict:
    """Retrieve a single chat record by its ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, timestamp, user_query, bot_response FROM chat_history WHERE id = ?",
            (chat_id,)
        )
        row = cursor.fetchone()
        if row:
            return {
                "id": row["id"],
                "timestamp": row["timestamp"],
                "user_query": row["user_query"],
                "bot_response": row["bot_response"]
            }
        else:
            return {}
    except Exception as e:
        logger.error(f"Error fetching chat by ID: {str(e)}")
        raise


all_chats = get_chat_history()
print("All chats:", all_chats)

# Get specific chat by ID
chat = get_chat_by_id(1)
print("Chat ID 1:", chat)