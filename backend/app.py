# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from chat import get_response

app = Flask(__name__)

CORS(app)


@app.route("/")
def index():
    return "Mental Health Chatbot API"

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        text = data.get("message", "")
        
        if not text:
            return jsonify({"error": "No message provided"}), 400
            
        response = get_response(text)
        message = {"answer": response}
        return jsonify(message)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5002)