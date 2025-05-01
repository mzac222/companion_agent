import React, { useState, useEffect } from 'react';
import { getChatHistory, getChatById } from '../services/api';
import { ArrowLeft, PlusCircle, Trash2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getChatHistory();
        console.log('History API Response:', response);

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
          
          // Convert to array and sort by timestamp (newest first)
          const sortedConversations = Object.values(sessions).sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
          );
          
          setConversations(sortedConversations);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
  }, []);

  const startNewSession = () => {
    // Clear any current session and navigate home
    localStorage.setItem('newSession', 'true');
    navigate('/');
  };

  const continueConversation = (sessionId) => {
    // Navigate to the chat page with the session ID
    navigate(`/chat/${sessionId}`);
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-lg font-semibold">Conversation History</h2>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* New Conversation Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={startNewSession}
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            New Conversation
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm">
            Error: {error}
          </div>
        )}

        {/* Conversation List */}
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No conversations yet</p>
              <button 
                onClick={startNewSession}
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Start your first conversation
              </button>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => continueConversation(conversation.id)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
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
                      <p className="text-sm text-gray-500 mt-1">
                        {getPreviewText(conversation.preview)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(conversation.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;