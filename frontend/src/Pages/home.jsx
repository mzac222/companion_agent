import React, { useState, useRef, useEffect } from 'react';
import '../index.css'; 
import {
    Info,
    X,
    Lightbulb,
  } from 'lucide-react';


const quickResponses = [
  "I'm feeling anxious today",
  "I need help with stress",
  "I'm feeling sad",
  "I can't sleep well",
  "I feel overwhelmed"
];

// Sample tips for mental wellness
const wellnessTips = [
  "Take deep breaths when feeling stressed",
  "Try to get 7-8 hours of sleep each night",
  "Stay hydrated throughout the day",
  "Take short breaks during work",
  "Practice mindfulness for 5 minutes daily",
  "Connect with a friend or family member today"
];

function Home() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [todaysTip, setTodaysTip] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);


  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  
    const initialMessage = {
      name: 'Star',
      message: `Hello ${savedUsername || 'there'}! I'm Star, your mental health companion. How are you feeling today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialMessage]);
  
    const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
    setTodaysTip(randomTip);
  
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);
  

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showEmojis]);

  const sendMessage = async (text = inputText) => {
    if (text.trim() === '') return;
    
    const messageText = text;
    setInputText('');
    setShowEmojis(false);
    
    // Add user message
    const userMessage = {
      name: 'User',
      message: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    try {
      // Make API call to Flask backend
      const response = await fetch(`/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setTimeout(() => {
        const botMessage = {
          name: 'Star',
          message: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error:', error);
      setTimeout(() => {
        const errorMessage = { 
          name: 'Star', 
          message: 'Sorry, I encountered an error. Please try again later.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleQuickResponse = (response) => {
    sendMessage(response);
  };

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
    inputRef.current?.focus();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col">
      <div className="text-center py-6 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          Mental Health Support Companion
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          A safe space to share your thoughts and feelings. I'm here to listen, support, and guide you through difficult times.
        </p>
      </div>
      
      <div className="container mx-auto px-4 flex-grow flex justify-center items-center pb-6">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-white shadow-md p-0.5 bg-white">
            <img 
              src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" 
              alt="avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <h4 className="font-medium text-lg">Star</h4>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
              <p className="text-indigo-100 text-sm">Online | Mental Health Companion</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowTips(!showTips)} 
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200"
          title="Wellness tips"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Wellness Tip Banner */}
      {showTips && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border-b border-indigo-100 flex items-start">
          <div className="text-indigo-600 mr-2 mt-0.5">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-indigo-800 font-medium">Today's Wellness Tip</p>
            <p className="text-xs text-indigo-600">{todaysTip}</p>
          </div>
          <button 
            onClick={() => setShowTips(false)}
            className="text-indigo-400 hover:text-indigo-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Quick Responses */}
      <div className="bg-gray-50 p-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2">
          {quickResponses.map((response, index) => (
            <button
              key={index}
              onClick={() => handleQuickResponse(response)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-white text-indigo-600 text-sm rounded-full border border-indigo-200 hover:bg-indigo-50 transition whitespace-nowrap flex-shrink-0 shadow-sm"
            >
              {response}
            </button>
          ))}
        </div>
      </div>
          
          {/* Chat Messages */}
          <div 
            ref={messagesContainerRef}
            className="flex-grow overflow-y-auto h-[100vh] p-4 bg-gradient-to-b from-gray-50 to-white"
            style={{ maxHeight: '400px' }}
          >
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.name === 'User' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                {msg.name !== 'User' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-indigo-100">
                    <img 
                      src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" 
                      alt="avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={`flex flex-col ${msg.name === 'User' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`px-4 py-3 rounded-2xl max-w-xs md:max-w-sm break-words ${
                      msg.name === 'User' 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{msg.timestamp}</span>
                </div>
                {msg.name === 'User' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden ml-2 flex-shrink-0 bg-indigo-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-indigo-100">
                  <img 
                    src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none border border-gray-200 px-4 py-3 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
        
          
          {/* Chat Input */}
          <div className="border-t border-gray-200 p-3 bg-white flex items-center">
            <button 
              onClick={() => setShowEmojis(!showEmojis)}
              className="text-gray-400 hover:text-indigo-500 mr-2 transition-colors"
              title="Add emoji"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center px-3 focus-within:ring-2 focus-within:ring-indigo-300 focus-within:bg-white transition-all">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                disabled={isLoading}
              />
              {inputText.trim() !== '' && (
                <button 
                  onClick={() => setInputText('')}
                  className="text-gray-400 hover:text-gray-600 ml-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <button 
              onClick={sendMessage}
              disabled={isLoading || inputText.trim() === ''}
              className={`ml-2 rounded-full w-12 h-12 flex items-center justify-center transition-all ${
                isLoading || inputText.trim() === '' 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:opacity-90'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-4 py-2 text-xs text-center text-gray-500 border-t border-gray-200">
            Your conversations are private and secure. If you're experiencing a crisis, please call your local emergency services.
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this to your index.

export default Home;