import sqlite3
from datetime import datetime
import threading
import logging
import uuid
import hashlib

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

def setup_database():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create tables if they don't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id INTEGER,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
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
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_username ON users (username)')
    
    conn.commit()
    logger.info("Database setup completed successfully")

def hash_password(password):
    """Simple password hashing (use proper hashing like bcrypt in production)"""
    return hashlib.sha256(password.encode()).hexdigest()

def register_user(username, email, password):
    """Register a new user"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if username or email already exists
        cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
        if cursor.fetchone():
            return {"success": False, "message": "Username or email already exists"}
        
        # Insert new user
        password_hash = hash_password(password)
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute(
            "INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (username, email, password_hash, created_at)
        )
        conn.commit()
        
        return {"success": True, "message": "User registered successfully"}
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        return {"success": False, "message": "Error registering user"}

def authenticate_user(username, password):
    """Authenticate a user"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, username, password_hash FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        
        if not user:
            return {"success": False, "message": "Invalid username or password"}
        
        if user['password_hash'] != hash_password(password):
            return {"success": False, "message": "Invalid username or password"}
        
        return {"success": True, "user_id": user['id'], "username": user['username']}
    except Exception as e:
        logger.error(f"Error authenticating user: {str(e)}")
        return {"success": False, "message": "Error authenticating user"}

def save_chat_to_db(user_query: str, bot_response: str, session_id=None, user_id=None):
    """Save a chat message to the database"""
    try:
        if session_id is None:
            session_id = str(uuid.uuid4())
            
        conn = get_db_connection()
        cursor = conn.cursor()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Create new session if it doesn't exist
        cursor.execute("SELECT id FROM sessions WHERE id = ?", (session_id,))
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO sessions (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)",
                (session_id, user_id, timestamp, timestamp)
            )
        
        # Save user message
        cursor.execute(
            """INSERT INTO messages 
               (session_id, role, content, timestamp) 
               VALUES (?, ?, ?, ?)""",
            (session_id, 'user', user_query, timestamp)
        )
        
        # Save bot response
        cursor.execute(
            """INSERT INTO messages 
               (session_id, role, content, timestamp) 
               VALUES (?, ?, ?, ?)""",
            (session_id, 'assistant', bot_response, timestamp)
        )
        
        # Update session timestamp
        cursor.execute(
            "UPDATE sessions SET updated_at = ? WHERE id = ?",
            (timestamp, session_id)
        )
        
        conn.commit()
        logger.debug(f"Saved messages to DB for session {session_id}")
        return session_id
    except Exception as e:
        logger.error(f"Error saving to database: {str(e)}")
        raise

def get_chat_history(user_id, limit=100):
    """Retrieve all chat sessions for a specific user with their latest message"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT s.id as session_id, s.created_at, s.updated_at, 
                   m.content as last_message, m.role as last_message_role
            FROM sessions s
            JOIN (
                SELECT session_id, MAX(timestamp) as max_timestamp
                FROM messages
                GROUP BY session_id
            ) latest ON s.id = latest.session_id
            JOIN messages m ON m.session_id = latest.session_id AND m.timestamp = latest.max_timestamp
            WHERE s.user_id = ?
            ORDER BY s.updated_at DESC
            LIMIT ?
        """, (user_id, limit))
        
        return [
            {
                "session_id": row["session_id"],
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
                "last_message": row["last_message"],
                "last_message_role": row["last_message_role"]
            }
            for row in cursor.fetchall()
        ]
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        raise

def get_chat_by_session(session_id, user_id=None):
    """Retrieve all messages for a specific session, optionally verifying user ownership"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verify session exists and optionally check user ownership
        query = "SELECT id FROM sessions WHERE id = ?"
        params = [session_id]
        
        if user_id:
            query += " AND user_id = ?"
            params.append(user_id)
            
        cursor.execute(query, params)
        if not cursor.fetchone():
            return {
                "session_id": session_id,
                "messages": [],
                "error": "Session not found or access denied"
            }
        
        # Get all messages
        cursor.execute("""
            SELECT id, role, content, timestamp
            FROM messages
            WHERE session_id = ?
            ORDER BY timestamp ASC
        """, (session_id,))
        
        messages = []
        for row in cursor.fetchall():
            messages.append({
                "id": row["id"],
                "timestamp": row["timestamp"],
                "content": row["content"],
                "role": row["role"]
            })
            
        return {
            "session_id": session_id,
            "messages": messages
        }
    except Exception as e:
        logger.error(f"Error fetching chat session {session_id}: {str(e)}")
        raise