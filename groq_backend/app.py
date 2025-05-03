from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from agent import MentalHealthAgent
from database import setup_database, save_chat_to_db, get_chat_history, get_db_connection
import logging
import os
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Initialize components
    try:
        setup_database()
        app.agent = MentalHealthAgent()
        logger.info("Application initialization complete")
    except Exception as e:
        logger.error(f"Failed to initialize application: {str(e)}")
        raise
    @app.route('/api/chat', methods=['POST'])
    def chat():
        try:
            data = request.get_json()
            session_id = data.get('session_id')
            user_message = data.get('message')
            
            if not user_message:
                return jsonify({"error": "No message provided", "status": "error"}), 400

            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Create new session if none exists
            if not session_id:
                session_id = str(uuid.uuid4())
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                cursor.execute(
                    "INSERT INTO sessions (id, created_at, updated_at) VALUES (?, ?, ?)",
                    (session_id, timestamp, timestamp)
                )
                conn.commit()
                logger.info(f"Created new session: {session_id}")

            # Save user message
            cursor.execute(
                "INSERT INTO messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
                (session_id, 'user', user_message, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            )
            
            # Get bot response
            bot_response = app.agent.get_response(user_message)
            
            # Save bot response
            cursor.execute(
                "INSERT INTO messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
                (session_id, 'assistant', bot_response, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            )
            
            # Update session timestamp
            cursor.execute(
                "UPDATE sessions SET updated_at = ? WHERE id = ?",
                (datetime.now().strftime("%Y-%m-%d %H:%M:%S"), session_id)
            )
            
            conn.commit()
            
            return jsonify({
                "response": bot_response,
                "session_id": session_id,
                "status": "success"
            })
            
        except Exception as e:
            logger.error(f"Error in chat endpoint: {str(e)}")
            return jsonify({"error": str(e), "status": "error"}), 500
    @app.route('/api/sessions', methods=['GET'])
    def get_sessions():
        try:
            # Get all sessions with their latest message
            sessions = []
            conn = get_db_connection()

            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sessions ORDER BY updated_at DESC")
            for session in cursor.fetchall():
                # Get messages for this session
                cursor.execute(
                    "SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp",
                    (session['id'],)
                )
                messages = cursor.fetchall()
                
                sessions.append({
                    "id": session['id'],
                    "created_at": session['created_at'],
                    "updated_at": session['updated_at'],
                    "messages": [{
                        "role": msg['role'],
                        "content": msg['content'],
                        "timestamp": msg['timestamp']
                    } for msg in messages]
                })
            
            return jsonify({"sessions": sessions, "status": "success"})
        except Exception as e:
            return jsonify({"error": str(e), "status": "error"}), 500
    @app.route('/api/sessions/<session_id>', methods=['GET'])
    def get_session(session_id):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # First check if session exists
            cursor.execute("SELECT * FROM sessions WHERE id = ?", (session_id,))
            session = cursor.fetchone()
            
            if not session:
                return jsonify({
                    "chat": {
                        "id": session_id,
                        "messages": []
                    },
                    "status": "success"
                })
            
            # Get all messages for this session
            cursor.execute(
                "SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp",
                (session_id,)
            )
            
            messages = []
            for msg in cursor.fetchall():
                messages.append({
                    "timestamp": msg["timestamp"],
                    "content": msg["content"],
                    "role": msg["role"]
                })
            
            return jsonify({
                "chat": {
                    "id": session_id,
                    "messages": messages
                },
                "status": "success"
            })
        except Exception as e:
            return jsonify({
                "error": str(e),
                "message": f"Failed to fetch session {session_id}",
                "status": "error"
            }), 500

    @app.route('/api/history', methods=['GET'])
    def history():
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Get the most recent message from each session
            cursor.execute("""
                SELECT ch1.session_id, ch1.timestamp, ch1.user_query, ch1.bot_response
                FROM chat_history ch1
                JOIN (
                    SELECT session_id, MAX(timestamp) as max_timestamp
                    FROM chat_history
                    WHERE session_id IS NOT NULL
                    GROUP BY session_id
                ) ch2
                ON ch1.session_id = ch2.session_id AND ch1.timestamp = ch2.max_timestamp
                ORDER BY ch1.timestamp DESC
            """)
            
            sessions = []
            for row in cursor.fetchall():
                sessions.append({
                    "id": row["session_id"],
                    "timestamp": row["timestamp"],
                    "title": row["user_query"] or "New Conversation",
                    "preview": row["bot_response"] or "No messages yet"
                })
            
            return jsonify({
                "sessions": sessions,
                "status": "success"
            })
        except Exception as e:
            logger.error(f"Error fetching history: {str(e)}")
            return jsonify({
                "error": str(e),
                "message": "Failed to fetch chat history",
                "status": "error"
            }), 500

    @app.route('/api/history/<session_id>', methods=['GET'])
    def history_by_id(session_id):
        # Directly return the session data without circular reference
        return get_session(session_id)
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy"})

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)