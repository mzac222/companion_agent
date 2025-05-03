import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sendMessage, getChatHistory, getChatById } from '../services/api';
import {
  Info,
  X,
  Lightbulb,
  Clock,
  History,
  PlusCircle,
  Settings,
  Send,
  Smile,
  User,
  Menu
} from 'lucide-react';
import ConversationSidebar from '../components/ConversationSideBar';

// Sample quick responses and wellness tips
const quickResponses = [
  "I'm feeling anxious today",
  "I need help with stress",
  "I'm feeling sad",
  "I can't sleep well",
  "I feel overwhelmed"
];

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
  const [username, setUsername] = useState('');
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const sessionMenuRef = useRef(null);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const { id: urlChatId } = useParams(); // Get chat ID from URL if present

  // Load initial messages and history

  // Add this useEffect hook (or update if it exists)
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  
    // Set today's tip
    const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
    setTodaysTip(randomTip);
    
    // Check if there's a chat ID in the URL
    if (urlChatId) {
      loadChatById(urlChatId);
    } else {
      // Check if we need to start a new session
      const newSessionFlag = localStorage.getItem('newSession');
      if (newSessionFlag) {
        localStorage.removeItem('newSession');
        setMessages([]);
        setCurrentSession(null);
      }
      // Show welcome message for new conversation
    }
  
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, [urlChatId]); // Add urlChatId as dependency
  
  // Update the loadChatById function
 
  const showWelcomeMessage = (username) => {
    const initialMessage = {
      name: 'Star',
      message: `Hello ${username || 'there'}! I'm Star, your mental health companion. How are you feeling today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialMessage]);
    setCurrentSession(null);
  };
 
  const loadChatById = async (chatId) => {
    try {
      setIsLoading(true);
      const response = await getChatById(chatId);
      
      if (response.status === 'success' && response.chat) {
        // Format messages for display
        const formattedMessages = response.chat.messages.map(msg => ({
          name: msg.role === 'user' ? 'User' : 'Star',
          message: msg.content,
          timestamp: new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }));
        
        setMessages(formattedMessages);
        setCurrentSession(chatId);
      } else {
        console.error('Invalid chat data received');
        showWelcomeMessage(username);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      showWelcomeMessage(username);
    } finally {
      setIsLoading(false);
    }
  };

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showEmojis]);
  
  // Update the sendMessageToBackend function to handle session updates
  const sendMessageToBackend = async (text = inputText) => {
    if (text.trim() === '') return;
    
    const messageText = text;
    setInputText('');
    setShowEmojis(false);
    
    // Add user message immediately
    const userMessage = {
      name: 'User',
      message: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          session_id: currentSession  // Send current session ID if exists
        })
      });
      
      const data = await response.json();
      
      const botMessage = {
        name: 'Star',
        message: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Update current session ID if this is a new conversation
      if (!currentSession && data.session_id) {
        setCurrentSession(data.session_id);
        // Update URL without refreshing page
        window.history.replaceState(null, '', `/chat/${data.session_id}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        name: 'Star',
        message: error.message || 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessageToBackend();
    }
  };

  const handleQuickResponse = (response) => {
    sendMessageToBackend(response);
  };

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
    inputRef.current?.focus();
  };

 // In Home.js
const handleNewSession = () => {
  setMessages([]);
  setCurrentSession(null);
  const savedUsername = localStorage.getItem('username');
  showWelcomeMessage(savedUsername);
  setInputText('');
  setTimeout(() => inputRef.current?.focus(), 100);
  setSidebarOpen(false);
  
  // Update URL to remove chat ID
  window.history.replaceState(null, '', '/');
};
  
  const handleSelectConversation = async (sessionId) => {
    if (sessionId === currentSession) {
      // Already selected, just close sidebar on mobile
      setSidebarOpen(false);
      return;
    }
    
    // Update URL
    navigate(`/chat/${sessionId}`);
    loadChatById(sessionId);
    setSidebarOpen(false);
  };

  const toggleSessionMenu = () => {
    setShowSessionMenu(!showSessionMenu);
  };

  const startNewSession = () => {
    // Set flag for new session and navigate to home
    localStorage.setItem('newSession', 'true');
    navigate('/');
    handleNewSession();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ConversationSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewSession={handleNewSession}
        onSelectConversation={handleSelectConversation}
        currentSessionId={currentSession}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <header className=" bg-gradient-to-r from-indigo-600 to-purple-600 text-white 0 shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 text-white">
  {/* Left Section: Title & Sidebar Toggle */}
  <div className="flex items-center gap-4">
    {/* Sidebar toggle for mobile */}
    <button
      onClick={() => setSidebarOpen(true)}
      className="p-3 rounded-md bg-white bg-opacity-20 hover:bg-opacity-40 transition-colors text-white md:hidden"
      aria-label="Open sidebar"
    >
      <Menu size={24} />
    </button>

    {/* Page title and subtitle with fun text */}
    <div>
      <h1 className="text-lg md:text-xl font-extrabold tracking-wide">
        {currentSession ? "Let's Chat! 💬" : "Start Your Mindful Journey 🌟"}
      </h1>
      <p className="text-sm italic opacity-90">
        {currentSession ? "Keep the conversation flowing..." : "Fresh thoughts, fresh start!"}
      </p>
    </div>
  </div>

  {/* Right Section: Icons & Dropdown */}
  <div className="flex items-center gap-3 relative">
    {/* Wellness Tips */}
    <button
      onClick={() => setShowTips(!showTips)}
      className="p-3 rounded-md bg-white bg-opacity-20 hover:bg-opacity-40 transition-colors text-white"
      title="Wellness Tips"
    >
      <Lightbulb size={20} />
    </button>

    {/* Session Menu */}
    <button
      onClick={toggleSessionMenu}
      className="p-3 rounded-md bg-white bg-opacity-20 hover:bg-opacity-40 transition-colors text-white"
      title="Session Options"
    >
      <Settings size={20} />
    </button>

    {/* Dropdown Menu */}
    {showSessionMenu && (
      <div
        ref={sessionMenuRef}
        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-md shadow-lg z-50 text-gray-800"
      >
        <button
          onClick={handleNewSession}
          className="w-full text-left px-5 py-3 text-sm hover:bg-gray-100"
        >
          New Session
        </button>
        {currentSession && (
          <button
            onClick={() => navigator.clipboard.writeText(currentSession)}
            className="w-full text-left px-5 py-3 text-sm hover:bg-gray-100"
          >
            Copy Session ID
          </button>
        )}
      </div>
    )}
  </div>
</header>


        {/* Wellness Tips Banner - Enhanced */}
        {showTips && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 transform -skew-y-12"></div>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center space-x-2">
                <Lightbulb size={18} className="text-yellow-300" />
                <h3 className="font-semibold text-white">Today's Wellness Tip</h3>
              </div>
              <button
                onClick={() => setShowTips(false)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Close tips"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mt-1.5 text-white/90 text-sm leading-relaxed max-w-3xl">{todaysTip}</p>
          </div>
        )}
        
        {/* Quick Response Suggestions - Moved to top */}
        <div className="py-2.5 px-4 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleQuickResponse(response)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-full transition-all text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:shadow-sm"
              >
                {response}
              </button>
            ))}
          </div>
        </div>
        
        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-2"
        >
          
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Welcome to MindfulChat</h3>
              <p className="text-gray-500 max-w-md">Start a conversation to get personalized wellness advice, meditation guidance, and more.</p>
            </div>
          
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.name === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.name !== 'User' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  <span className="text-indigo-600 text-sm font-medium">A</span>
                </div>
              )}
              
              <div
                className={`max-w-sm md:max-w-md lg:max-w-lg rounded-2xl p-3.5 ${
                  msg.name === 'User'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-100 shadow-sm'
                }`}
              >
                <p className={`text-sm ${msg.name === 'User' ? 'text-white' : 'text-gray-800'}`}>
                  {msg.message}
                </p>
                <span className={`text-xs mt-1.5 block ${
                  msg.name === 'User' ? 'text-indigo-200' : 'text-gray-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
              
              {msg.name === 'User' && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center ml-3 flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                <span className="text-indigo-600 text-sm font-medium">A</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center w-2/3 mx-auto bg-gray-50 rounded-full shadow-sm border border-gray-200 pr-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 py-2.5 px-3 bg-transparent border-none focus:outline-none text-sm"
            />
            <button
              onClick={() => sendMessageToBackend()}
              disabled={inputText.trim() === ''}
              className={`p-2 rounded-full ${
                inputText.trim() === ''
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-white bg-indigo-600 hover:bg-indigo-700 transition-colors'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          
          <p className="text-xs text-gray-400 mt-2 text-center">
            Your wellness assistant is here to help. Responses are AI-generated.
          </p>
        </div>
      </div>
    </div>
  );}

  export default Home;