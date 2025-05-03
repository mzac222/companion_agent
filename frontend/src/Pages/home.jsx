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
  Menu,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import ConversationSidebar from '../components/ConversationSideBar';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
  const { id: urlChatId } = useParams();
  
  // Text-to-speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const speechSynthesisRef = useRef(window.speechSynthesis);

  // Speech recognition hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Update input text with speech recognition transcript
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Toggle speech recognition
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ 
        continuous: true, 
        language: 'en-US',
        interimResults: true
      });
      resetTranscript();
    }
  };

  // Toggle text-to-speech
  const toggleTextToSpeech = () => {
    // If turning off, stop any current speech
    if (textToSpeechEnabled) {
      stopSpeaking();
    }
    
    // Toggle the state
    setTextToSpeechEnabled(!textToSpeechEnabled);
    
    // Save preference to localStorage
    localStorage.setItem('textToSpeechEnabled', !textToSpeechEnabled);
  };

  // Function to stop speaking
  const stopSpeaking = () => {
    const synth = speechSynthesisRef.current;
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  // Function to speak text
  const speakText = (text) => {
    if (!textToSpeechEnabled) return;
    
    // Cancel any ongoing speech first
    stopSpeaking();
    
    const synth = speechSynthesisRef.current;
    if (synth) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Optional: Configure voice properties
      utterance.rate = 1; // Speed: 0.1 to 10
      utterance.pitch = 1; // Pitch: 0 to 2
      utterance.volume = 1; // Volume: 0 to 1
      
      // Get available voices and select a preferably female voice
      const voices = synth.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Google UK English Female')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      // Add events
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      // Speak
      synth.speak(utterance);
    }
  };

  // Load initial messages and user preferences
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // Load text-to-speech preference
    const ttsEnabled = localStorage.getItem('textToSpeechEnabled');
    if (ttsEnabled !== null) {
      setTextToSpeechEnabled(ttsEnabled === 'true');
    }

    // Set today's tip
    const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
    setTodaysTip(randomTip);
    
    // Check if there's a chat ID in the URL
    if (urlChatId) {
      loadChatById(urlChatId);
    } else {
      const newSessionFlag = localStorage.getItem('newSession');
      if (newSessionFlag) {
        localStorage.removeItem('newSession');
        setMessages([]);
        setCurrentSession(null);
      }
      showWelcomeMessage(savedUsername);
    }
  
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
    
    // Initialize voices
    const synth = speechSynthesisRef.current;
    if (synth) {
      // Firefox needs this
      if (synth.getVoices().length === 0) {
        synth.addEventListener('voiceschanged', () => {
          // Voices loaded
        });
      }
    }
    
    // Clean up speech synthesis on unmount
    return () => {
      stopSpeaking();
    };
  }, [urlChatId]);

  const showWelcomeMessage = (username) => {
    const welcomeMessage = `Hello ${username || 'there'}! I'm Star, your mental health companion. How are you feeling today?`;
    const initialMessage = {
      name: 'Star',
      message: welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialMessage]);
    setCurrentSession(null);
    
    // Speak welcome message if text-to-speech is enabled
    if (textToSpeechEnabled) {
      setTimeout(() => speakText(welcomeMessage), 500);
    }
  };

  // const loadChatById = async (chatId) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await getChatById(chatId);
      
  //     if (response.status === 'success' && response.chat) {
  //       const formattedMessages = response.chat.messages.map(msg => ({
  //         name: msg.role === 'user' ? 'User' : 'Star',
  //         message: msg.content,
  //         timestamp: new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { 
  //           hour: '2-digit', 
  //           minute: '2-digit' 
  //         })
  //       }));
        
  //       setMessages(formattedMessages);
  //       setCurrentSession(chatId);
  //     } else {
  //       console.error('Invalid chat data received');
  //       showWelcomeMessage(username);
  //     }
  //   } catch (error) {
  //     console.error('Error loading chat:', error);
  //     showWelcomeMessage(username);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showEmojis]);
  
 // In your Home component
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
    const userId = localStorage.getItem('user_id');
    const response = await sendMessage(messageText, currentSession, userId);
    
    const botMessage = {
      name: 'Star',
      message: response.response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, botMessage]);
    
    // Speak the bot's response if text-to-speech is enabled
    if (textToSpeechEnabled) {
      speakText(response.response);
    }
    
    if (!currentSession && response.session_id) {
      setCurrentSession(response.session_id);
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
    
    // Speak the error message if text-to-speech is enabled
    if (textToSpeechEnabled) {
      speakText(errorMessage.message);
    }
  } finally {
    setIsLoading(false);
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  }
};

const loadChatById = async (chatId) => {
  try {
    setIsLoading(true);
    const userId = localStorage.getItem('user_id');
    const response = await getChatById(chatId, userId);
    
    console.log('Chat data:', response); // Debugging log
    
    if (response.chat && response.chat.messages) {
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
      console.error('Invalid chat data received:', response);
      showWelcomeMessage(username);
    }
  } catch (error) {
    console.error('Error loading chat:', error);
    showWelcomeMessage(username);
  } finally {
    setIsLoading(false);
  }
};

// Update the ConversationSidebar component usage

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

  const handleNewSession = () => {
    setMessages([]);
    setCurrentSession(null);
    const savedUsername = localStorage.getItem('username');
    showWelcomeMessage(savedUsername);
    setInputText('');
    setTimeout(() => inputRef.current?.focus(), 100);
    setSidebarOpen(false);
    window.history.replaceState(null, '', '/');
  };
  
  const handleSelectConversation = async (sessionId) => {
    if (sessionId === currentSession) {
      setSidebarOpen(false);
      return;
    }
    
    navigate(`/chat/${sessionId}`);
    loadChatById(sessionId);
    setSidebarOpen(false);
  };

  const toggleSessionMenu = () => {
    setShowSessionMenu(!showSessionMenu);
  };

  const startNewSession = () => {
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
        userId={localStorage.getItem('user_id')}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 rounded-md bg-white bg-opacity-20 hover:bg-opacity-40 transition-colors text-white md:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>

            <div>
              <h1 className="text-lg md:text-xl font-extrabold tracking-wide">
                {currentSession ? "Let's Chat! 💬" : "Start Your Mindful Journey 🌟"}
              </h1>
              <p className="text-sm italic opacity-90">
                {currentSession ? "Keep the conversation flowing..." : "Fresh thoughts, fresh start!"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Text-to-Speech Toggle Button */}
            <button
              onClick={toggleTextToSpeech}
              className={`p-3 rounded-md ${
                textToSpeechEnabled 
                  ? 'bg-green-600 bg-opacity-70 hover:bg-opacity-90' 
                  : 'bg-white bg-opacity-20 hover:bg-opacity-40'
              } transition-colors text-white`}
              title={textToSpeechEnabled ? "Disable voice responses" : "Enable voice responses"}
            >
              {textToSpeechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            
            <button
              onClick={() => setShowTips(!showTips)}
              className="p-3 rounded-md bg-white bg-opacity-20 hover:bg-opacity-40 transition-colors text-white"
              title="Wellness Tips"
            >
              <Lightbulb size={20} />
            </button>

            <button
              onClick={toggleSessionMenu}
              className="p-3 rounded-md bg-white bg-opacity-20 hover:bg-opacity-40 transition-colors text-white"
              title="Session Options"
            >
              <Settings size={20} />
            </button>

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

        {/* Wellness Tips Banner */}
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
        
        {/* Quick Response Suggestions */}
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
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Welcome to MindfulChat</h3>
              <p className="text-gray-500 max-w-md">Start a conversation to get personalized wellness advice, meditation guidance, and more.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
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
                  <div className="flex justify-between items-center mt-1.5">
                    <span className={`text-xs ${
                      msg.name === 'User' ? 'text-indigo-200' : 'text-gray-400'
                    }`}>
                      {msg.timestamp}
                    </span>
                    
                    {/* Text-to-speech button for Star's messages */}
                    {msg.name !== 'User' && (
                      <button 
                        onClick={() => speakText(msg.message)}
                        className="text-indigo-500 hover:text-indigo-700 p-0.5 rounded-full text-xs"
                        title="Read aloud"
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                
                {msg.name === 'User' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center ml-3 flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                )}
              </div>
            ))
          )}
          
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
        
        {/* Input Area with Voice and Speech Controls */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center w-full max-w-2xl mx-auto bg-gray-50 rounded-full shadow-sm border border-gray-200 pr-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={listening ? "Listening... Speak now" : "Type your message..."}
              className="flex-1 py-2.5 px-4 bg-transparent border-none focus:outline-none text-sm"
            />
            
            {/* Text-to-speech status indicator (when actively speaking) */}
            {isSpeaking && (
              <div className="mr-2 flex items-center">
                <div className="relative w-5 h-5">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-25 animate-ping"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Volume2 size={12} className="text-indigo-600" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Voice Input Button */}
            {browserSupportsSpeechRecognition && isMicrophoneAvailable && (
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full mx-1 ${
                  listening 
                    ? 'text-red-600 bg-red-100 hover:bg-red-200' 
                    : 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200'
                } transition-colors`}
                title={listening ? "Stop listening" : "Start voice input"}
              >
                {listening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
            
            {/* Send Button */}
            <button
              onClick={() => sendMessageToBackend()}
              disabled={inputText.trim() === '' || isLoading}
              className={`p-2 rounded-full ${
                inputText.trim() === '' || isLoading
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-white bg-indigo-600 hover:bg-indigo-700 transition-colors'
              }`}
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-400 mt-2 px-2">
            <p>
              {!browserSupportsSpeechRecognition 
                ? "Your browser doesn't support voice input."
                : !isMicrophoneAvailable
                ? "Microphone access is required for voice input"
                : listening ? "Listening..." : "Press the mic icon to speak"}
            </p>
            <p>
              {textToSpeechEnabled ? "Voice responses enabled" : "Voice responses disabled"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;