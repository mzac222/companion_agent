import React, { useState, useEffect } from 'react';
import { getChatHistory, getChatById } from '../services/api'; // Import getChatById
import { MessageSquare, PlusCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConversationSidebar = ({ isOpen, onClose, onNewSession, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await getChatHistory();
        
        if (response.history) {
          // Group conversations by session and get the latest message
          const sessions = {};
          response.history.forEach(item => {
            if (!sessions[item.session_id] || new Date(item.timestamp) > new Date(sessions[item.session_id].timestamp)) {
              sessions[item.session_id] = {
                id: item.session_id,
                title: item.user_query || "New Conversation",
                timestamp: item.timestamp,
                preview: item.bot_response || ""
              };
            }
          });
          
          setConversations(Object.values(sessions));
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // New function to handle conversation selection
  const handleSelectConversation = async (sessionId) => {
    try {
      setIsLoading(true);
      // Fetch the full conversation by ID
      const conversation = await getChatById(sessionId);
      
      if (conversation) {
        setSelectedConversation(conversation);
        // Pass both the ID and the conversation data to the parent component
        onSelectConversation(sessionId, conversation);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPreviewText = (text) => {
    if (!text) return "No messages yet";
    return text.length > 40 ? text.substring(0, 40) + '...' : text;
  };

  return (
    <div className={`min-h-screen fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out `}>
      <div className="flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-lg font-semibold">Your Conversations</h2>
          <button 
            onClick={onClose}
            className="md:hidden text-white hover:text-indigo-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        
        {/* New Conversation Button */}
        <div className="p-3 border-b border-gray-200">
          <button
            onClick={onNewSession}
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            New Conversation
          </button>
        </div>
        
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {conversation.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {getPreviewText(conversation.preview)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(conversation.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationSidebar;