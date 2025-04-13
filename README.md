# 🧠 Mental Health Chatbot (React + Flask + ML)

This is a simple mental health support chatbot that uses a machine learning model (PyTorch) with a Flask backend and a Vite + React frontend. The chatbot understands user queries and responds with supportive messages based on intent classification.

---

## 🚀 Features

- Intent-based classification using a custom-trained PyTorch model
- Flask backend with API to serve predictions
- React + Vite frontend to chat with the bot
- Easily extendable intent data (add your own questions/responses)
- Hot-reloading frontend and backend for smooth development

---


## ⚛️ Frontend Setup (Vite + React)

```bash
cd frontend
npm install
npm run dev

The React app will run at: http://localhost:5173
🧠 Backend Setup (Flask + ML)

cd backend
python train.py  # Run this to train the model whenever you make changes to intents or model code
python app.py    # The Flask server will run at http://127.0.0.1:5000

