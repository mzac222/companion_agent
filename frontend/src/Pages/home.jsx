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
      showWelcomeMessage(savedUsername);
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
      const response = await sendMessage(messageText, currentSession);
      
      const botMessage = {
        name: 'Star',
        message: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Update current session ID if this is a new conversation
      if (!currentSession && response.session_id) {
        setCurrentSession(response.session_id);
        // Update URL without refreshing page
        window.history.replaceState(null, '', `/chat/${response.session_id}`);
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
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm border-b border-indigo-100 shadow-sm px-4 py-4">
        <div className=" mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden mr-3 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h1 className="ml-3 text-xl md:text-2xl font-bold text-indigo-800">Your Mental Health Companion ❤️</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/history')}
              className="bg-white hover:bg-indigo-50 text-indigo-600 rounded-full p-2 shadow-sm flex items-center transition-all"
              title="View History"
            >
              <History className="w-5 h-5" />
            </button>
            
            <button 
              onClick={toggleSessionMenu}
              className="bg-white hover:bg-indigo-50 text-indigo-600 rounded-full p-2 shadow-sm flex items-center transition-all"
              title="Session Menu"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            {showSessionMenu && (
              <div className="absolute right-4 top-16 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-10 border border-indigo-50" ref={sessionMenuRef}>
                <div className="py-1 divide-y divide-gray-100">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">Session Options</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        startNewSession();
                        setShowSessionMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
                    >
                      <PlusCircle className="w-4 h-4 mr-2 text-indigo-500" />
                      Start New Conversation
                    </button>
                    <button
                      onClick={() => {
                        navigate('/history');
                        setShowSessionMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
                    >
                      <History className="w-4 h-4 mr-2 text-indigo-500" />
                      View Conversation History
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ConversationSidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewSession={handleNewSession}
          onSelectConversation={handleSelectConversation}
        />
        
        {/* Main Chat Area */}
        <div className="flex-1 px-4 py-6 md:py-8 flex justify-center items-start overflow-hidden">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100 flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-white shadow-md p-0.5 bg-white">
                  <img 
                    src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" 
                    alt="Star avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white">
                  <h4 className="font-medium text-lg">Star</h4>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                    <p className="text-indigo-100 text-sm">
                      {currentSession ? `Session #${currentSession}` : 'New Conversation'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={startNewSession}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full px-3 py-1.5 text-sm flex items-center transition-all"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  New Chat
                </button>
                <button 
                  onClick={() => setShowTips(!showTips)} 
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200"
                  title="Wellness tips"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Wellness Tip Banner */}
            {showTips && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-indigo-100 flex items-start animate-fadeIn">
                <div className="text-indigo-600 mr-3 mt-0.5">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-indigo-800 font-medium mb-1">Today's Wellness Tip</p>
                  <p className="text-sm text-indigo-600">{todaysTip}</p>
                </div>
                <button 
                  onClick={() => setShowTips(false)}
                  className="text-indigo-400 hover:text-indigo-600 ml-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Quick Responses */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-3 border-b border-gray-100 overflow-x-auto scrollbar-hide shadow-sm">
              <div className="flex space-x-2">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickResponse(response)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-white text-indigo-600 text-sm rounded-full border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition whitespace-nowrap flex-shrink-0 shadow-sm"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chat Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-grow overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white"
              style={{ height: '400px', maxHeight: '60vh' }}
            >
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.name === 'User' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  {msg.name !== 'User' && (
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-indigo-100 shadow-sm">
                      <img 
                        src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" 
                        alt="Star avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`flex flex-col ${msg.name === 'User' ? 'items-end' : 'items-start'} max-w-xs md:max-w-md`}>
                    <div 
                      className={`px-4 py-3 rounded-2xl break-words ${
                        msg.name === 'User' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-none shadow-md' 
                          : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.message}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 mx-1">{msg.timestamp}</span>
                  </div>
                  {msg.name === 'User' && (
                    <div className="w-10 h-10 rounded-full overflow-hidden ml-2 flex-shrink-0 bg-indigo-100 flex items-center justify-center shadow-sm">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-indigo-100 shadow-sm">
                    <img 
                      src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" 
                      alt="Star avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none border border-gray-200 px-5 py-4 shadow-sm">
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
            <div className="border-t border-gray-200 p-4 bg-white shadow-inner">
              <div className="flex items-center">
                <button 
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="text-gray-400 hover:text-indigo-500 mr-3 transition-colors"
                  title="Add emoji"
                >
                  <Smile className="h-6 w-6" />
                </button>
                <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-1 focus-within:ring-2 focus-within:ring-indigo-300 focus-within:bg-white transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="flex-1 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    disabled={isLoading}
                  />
                  {inputText.trim() !== '' && (
                    <button 
                      onClick={() => setInputText('')}
                      className="text-gray-400 hover:text-gray-600 ml-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => sendMessageToBackend()}
                  disabled={isLoading || inputText.trim() === ''}
                  className={`ml-3 rounded-full w-12 h-12 flex items-center justify-center transition-all ${
                    isLoading || inputText.trim() === '' 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      :  'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Emoji Picker */}
              {showEmojis && (
                <div className="mt-3 bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
                  <div className="grid grid-cols-8 gap-2">
                    {['😀', '😊', '😂', '😍', '🥰', '😎', '😢', '😡', '🤗', '😴', '👍', '❤️', '🙏', '🤔', '😇', '🥺'].map((emoji, i) => (
                      <button
                        key={i}
                        onClick={() => addEmoji(emoji)}
                        className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;