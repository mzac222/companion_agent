import sqlite3
from datetime import datetime
import threading
import logging
import uuid

logger = logging.getLogger(__name__)

# Thread-local storage for database connections
local_storage = threading.local()

def get_db_connection():
    """Get a thread-local database connection"""
    if not hasattr(local_storage, 'connection'):
        local_storage.connection = sqlite3.connect(
            "chat_history.db",
            check_same_thread=False,
            timeout=10
        )
        local_storage.connection.row_factory = sqlite3.Row
    return local_storage.connection

# In your database.py
def setup_database():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create tables if they don't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        )
    ''')
    
    # Create indexes for better performance
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages (session_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_sessions_updated_at ON sessions (updated_at)')
    
    conn.commit()
    logger.info("Database setup completed successfully")
def save_chat_to_db(user_query: str, bot_response: str, session_id=None):
    """Save a chat message to the database"""
    try:
        if session_id is None:
            session_id = str(uuid.uuid4())
            
        conn = get_db_connection()
        cursor = conn.cursor()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Get the next message order number for this session
        cursor.execute("""
            SELECT MAX(message_order) as max_order 
            FROM chat_history 
            WHERE session_id = ?
        """, (session_id,))
        max_order = cursor.fetchone()['max_order'] or 0
        
        # Save user message
        cursor.execute(
            """INSERT INTO chat_history 
               (timestamp, user_query, bot_response, session_id, is_user, message_order) 
               VALUES (?, ?, ?, ?, ?, ?)""",
            (timestamp, user_query, None, session_id, True, max_order + 1)
        )
        
        # Save bot response
        cursor.execute(
            """INSERT INTO chat_history 
               (timestamp, user_query, bot_response, session_id, is_user, message_order) 
               VALUES (?, ?, ?, ?, ?, ?)""",
            (timestamp, None, bot_response, session_id, False, max_order + 2)
        )
        
        conn.commit()
        logger.debug(f"Saved messages to DB for session {session_id}")
        return session_id
    except Exception as e:
        logger.error(f"Error saving to database: {str(e)}")
        raise

def get_chat_history(limit=100):
    """Retrieve all chat sessions with their latest message"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT ch1.* FROM chat_history ch1
            JOIN (
                SELECT session_id, MAX(timestamp) as max_timestamp
                FROM chat_history
                WHERE session_id IS NOT NULL
                GROUP BY session_id
            ) ch2
            ON ch1.session_id = ch2.session_id AND ch1.timestamp = ch2.max_timestamp
            ORDER BY ch1.timestamp DESC
            LIMIT ?
        """, (limit,))
        
        return [
            {
                "id": row["id"],
                "session_id": row["session_id"],
                "timestamp": row["timestamp"],
                "user_query": row["user_query"],
                "bot_response": row["bot_response"],
                "is_user": bool(row["is_user"])
            }
            for row in cursor.fetchall()
        ]
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        raise

def get_chat_by_session(session_id):
    """Retrieve all messages for a specific session"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, timestamp, user_query, bot_response, is_user
            FROM chat_history
            WHERE session_id = ?
            ORDER BY message_order ASC
        """, (session_id,))
        
        messages = []
        for row in cursor.fetchall():
            messages.append({
                "id": row["id"],
                "timestamp": row["timestamp"],
                "content": row["user_query"] if row["is_user"] else row["bot_response"],
                "role": "user" if row["is_user"] else "assistant"
            })
            
        return {
            "session_id": session_id,
            "messages": messages
        }
    except Exception as e:
        logger.error(f"Error fetching chat session: {str(e)}")
        raise

# Remove the test code at the bottom of the file