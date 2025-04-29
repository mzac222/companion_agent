from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from agent import MentalHealthAgent
from database import setup_database, save_chat_to_db, get_chat_history
import logging
import os
from datetime import datetime

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
        app.agent = MentalHealthAgent()  # Now properly attached to app
        logger.info("Application initialization complete")
    except Exception as e:
        logger.error(f"Failed to initialize application: {str(e)}")
        raise

    @app.route('/api/chat', methods=['POST'])
    def chat():
        try:
            data = request.get_json()
            if not data or 'message' not in data:
                return jsonify({
                    "error": "No message provided",
                    "status": "error"
                }), 400
            
            user_input = data['message']
            logger.info(f"Processing message: {user_input[:50]}...")
            
            # Get response from agent
            response = app.agent.get_response(user_input)
            
            # Save to database
            save_chat_to_db(user_input, response)
            
            return jsonify({
                "response": response,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "status": "success"
            })
            
        except Exception as e:
            logger.error(f"Error in chat endpoint: {str(e)}")
            return jsonify({
                "error": str(e),
                "message": "Failed to process your message",
                "status": "error"
            }), 500

    @app.route('/api/history', methods=['GET'])
    def history():
        try:
            history = get_chat_history()
            return jsonify({
                "history": history,
                "status": "success"
            })
        except Exception as e:
            logger.error(f"Error fetching history: {str(e)}")
            return jsonify({
                "error": str(e),
                "message": "Failed to fetch chat history",
                "status": "error"
            }), 500
        
    @app.route('/api/history/<int:chat_id>', methods=['GET'])
    def history_by_id(chat_id):
        try:
            chat = get_chat_by_id(chat_id)
            if not chat:
                return jsonify({
                    "error": "Chat not found",
                    "status": "error"
                }), 404
            
            return jsonify({
                "chat": chat,
                "status": "success"
            })
        except Exception as e:
            logger.error(f"Error fetching chat with ID {chat_id}: {str(e)}")
            return jsonify({
                "error": str(e),
                "message": f"Failed to fetch chat with ID {chat_id}",
                "status": "error"
            }), 500

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy"})

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)