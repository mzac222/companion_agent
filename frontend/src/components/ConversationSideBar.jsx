import React, { useState, useEffect } from 'react';
import { MessageSquare, PlusCircle, ArrowLeft, Search, X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConversationSidebar = ({ isOpen, onClose, onNewSession, onSelectConversation, currentSessionId, userId }) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState(currentSessionId);
  const navigate = useNavigate();

  // Fetch conversations list when userId changes
  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  // Update active ID whenever currentSessionId changes
  useEffect(() => {
    if (currentSessionId) {
      setActiveId(currentSessionId);
    }
  }, [currentSessionId]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/sessions?user_id=${userId}`);
      
      if (!response.ok) throw new Error('Failed to fetch sessions');
      
      const data = await response.json();
      
      if (data.sessions) {
        // First, group messages by session_id
        const sessionsMap = data.sessions.reduce((acc, session) => {
          if (!acc[session.session_id]) {
            acc[session.session_id] = {
              id: session.session_id,
              created_at: session.created_at,
              updated_at: session.updated_at,
              messages: []
            };
          }
          
          // Add the message to the session
          acc[session.session_id].messages.push({
            role: session.last_message_role,
            content: session.last_message,
            timestamp: session.updated_at || session.created_at
          });
          
          return acc;
        }, {});
  
        // Then process each session
        const processedSessions = Object.values(sessionsMap).map(session => {
          const userMessages = session.messages.filter(m => m.role === 'user');
          const assistantMessages = session.messages.filter(m => m.role === 'assistant');
          
          const lastUserMessage = userMessages[0]; // Most recent user message
          const lastAssistantMessage = assistantMessages[0]; // Most recent assistant message
          
          return {
            id: session.id,
            title: lastUserMessage?.content || "New Conversation",
            preview: lastAssistantMessage?.content || "No messages yet",
            timestamp: session.updated_at || session.created_at
          };
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setConversations(processedSessions);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConversations = searchQuery 
    ? conversations.filter(convo => 
        convo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        convo.preview.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const handleSelectConversation = (conversation) => {
    setActiveId(conversation.id);
    onSelectConversation(conversation.id);
    
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPreviewText = (text) => {
    if (!text) return "No messages yet";
    return text.length > 40 ? `${text.substring(0, 40)}...` : text;
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleNewSession = () => {
    setActiveId(null);
    onNewSession();
    
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div 
      className={`min-h-screen fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-indigo-50 to-white shadow-xl transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 
        transition-transform duration-300 ease-in-out z-20 flex flex-col`}
    >
      {/* Header */}
      <div className="py-5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <h2 
            onClick={() => navigate('/')} 
            className="text-lg font-bold cursor-pointer hover:text-indigo-100 transition-colors"
          >
            Go Home
          </h2>
         
          <div className="flex space-x-2">
      <button 
        onClick={() => {
          // Simple logout - clear localStorage
          localStorage.removeItem('user_id');
          localStorage.removeItem('username');
          localStorage.removeItem('currentSessionId');
          // Refresh the page to reset the app state
          navigate('/login')
        }}
        className="p-1.5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
        title="Logout"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-5 h-5" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
      <button 
        onClick={onClose}
        className="p-1.5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all md:hidden"
        title="Close Sidebar"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  </div>
        {/* Search */}
        <div className="mt-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-200" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg 
                placeholder-indigo-200 text-white border border-white border-opacity-20 
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40"
            />
            {searchQuery && (
              <button 
                onClick={clearSearch} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-indigo-200 hover:text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error message if any */}
      {error && (
        <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
          <button 
            onClick={fetchConversations}
            className="mt-1 text-sm text-red-600 underline hover:text-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-32 p-4">
            <div className="w-8 h-8 border-t-2 border-indigo-600 border-r-2 border-b-2 border-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-indigo-600">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {searchQuery ? (
              <>
                <div className="bg-indigo-100 p-3 rounded-full mb-3">
                  <Search className="w-6 h-6 text-indigo-500" />
                </div>
                <p className="text-gray-600 mb-2">No matching conversations</p>
                <button 
                  onClick={clearSearch}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <div className="bg-indigo-100 p-3 rounded-full mb-3">
                  <MessageSquare className="w-6 h-6 text-indigo-500" />
                </div>
                <p className="text-gray-600 mb-2">No conversations yet</p>
                <button 
                  onClick={handleNewSession}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Start a new one
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${activeId === conversation.id 
                    ? 'bg-indigo-100 border-indigo-200 shadow-sm' 
                    : 'hover:bg-gray-50 border-transparent'
                  } border`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-full flex-shrink-0
                      ${activeId === conversation.id 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-indigo-100 text-indigo-600'}`}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium truncate
                        ${activeId === conversation.id ? 'text-indigo-900' : 'text-gray-800'}`}
                      >
                        {conversation.title || "New Conversation"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {getPreviewText(conversation.preview)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap mt-1 flex-shrink-0">
                    {formatDate(conversation.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white bg-opacity-70 backdrop-blur-sm">
        <button
          onClick={handleNewSession}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 
            hover:from-indigo-600 hover:to-purple-600 text-white py-2.5 px-4 rounded-lg 
            transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="font-medium">New Chat</span>
        </button>
      </div>
    </div>
  );
};

export default ConversationSidebar;