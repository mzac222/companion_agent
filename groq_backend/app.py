from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from agent import MentalHealthAgent
from database import (
    setup_database, 
    register_user, 
    authenticate_user,
    save_chat_to_db, 
    get_chat_history, 
    get_chat_by_session,
    get_db_connection
)
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

    # User Authentication Endpoints
    @app.route('/api/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            
            result = register_user(username, email, password)
            if result['success']:
                return jsonify({
                    "success": True,
                    "user_id": result.get('user_id'),
                    "username": username,
                    "message": "Registration successful"
                }), 201
            return jsonify(result), 400
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return jsonify({
                "success": False,
                "message": "Registration failed"
            }), 500

    @app.route('/api/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
            
            result = authenticate_user(username, password)
            if result['success']:
                return jsonify({
                    "success": True,
                    "user_id": result['user_id'],
                    "username": result['username'],
                    "message": "Login successful"
                }), 200
            return jsonify(result), 401
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return jsonify({
                "success": False,
                "message": "Login failed"
            }), 500

    # Chat Endpoints
    @app.route('/api/chat', methods=['POST'])
    def chat():
        try:
            data = request.get_json()
            session_id = data.get('session_id')
            user_message = data.get('message')
            user_id = data.get('user_id')
            
            if not user_message:
                return jsonify({"error": "No message provided", "status": "error"}), 400

            # Get bot response
            bot_response = app.agent.get_response(user_message)
            
            # Save to database
            session_id = save_chat_to_db(
                user_query=user_message,
                bot_response=bot_response,
                session_id=session_id,
                user_id=user_id
            )
            
            return jsonify({
                "response": bot_response,
                "session_id": session_id,
                "status": "success"
            })
        except Exception as e:
            logger.error(f"Chat error: {str(e)}")
            return jsonify({"error": str(e), "status": "error"}), 500

    # Session Endpoints
    @app.route('/api/sessions', methods=['GET'])
    def get_sessions():
        try:
            user_id = request.args.get('user_id')
            if not user_id:
                return jsonify({"error": "User ID required", "status": "error"}), 400
                
            sessions = get_chat_history(user_id)
            return jsonify({
                "sessions": sessions,
                "status": "success"
            })
        except Exception as e:
            logger.error(f"Get sessions error: {str(e)}")
            return jsonify({"error": str(e), "status": "error"}), 500

    @app.route('/api/sessions/<session_id>', methods=['GET'])
    def get_session(session_id):
        try:
            user_id = request.args.get('user_id')
            chat_session = get_chat_by_session(session_id, user_id)
            return jsonify({
                "chat": chat_session,
                "status": "success"
            })
        except Exception as e:
            logger.error(f"Get session error: {str(e)}")
            return jsonify({
                "error": str(e),
                "status": "error"
            }), 500

    # Health Check
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy"})

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)