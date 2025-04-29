import React, { useState, useEffect } from 'react';
import { getChatHistory, getChatById } from '../services/api';
import { ArrowLeft, PlusCircle, Trash2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupedHistory, setGroupedHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getChatHistory();
        setHistory(response.history || []);
        
        // Group conversations by date
        if (response.history && response.history.length > 0) {
          const grouped = groupConversationsByDate(response.history);
          setGroupedHistory(grouped);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  const groupConversationsByDate = (historyItems) => {
    const groups = {};
    
    historyItems.forEach(item => {
      const date = new Date(item.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    
    // Convert to array format and sort by date (newest first)
    return Object.entries(groups)
      .map(([date, items]) => ({ date, items }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const startNewSession = () => {
    // Set flag for new session and navigate to home
    localStorage.setItem('newSession', 'true');
    navigate('/');
  };

  // In HistoryPage.js
const continueConversation = async (sessionId) => {
    try {
      // Navigate directly to the chat page with the session ID
      navigate(`/chat/${sessionId}`);
    } catch (error) {
      console.error('Error loading conversation:', error);
      // You might want to add error handling here (e.g., toast notification)
    }
  };
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPreviewText = (text) => {
    return text.length > 60 ? text.substring(0, 60) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="text-white mr-4 hover:bg-white hover:bg-opacity-20 rounded-full p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-white">Chat History</h2>
          </div>
          <button 
            onClick={startNewSession}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200 flex items-center"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="ml-1 text-sm hidden md:inline">New Conversation</span>
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-indigo-50 inline-flex rounded-full p-4 mb-4">
                <MessageSquare className="h-8 w-8 text-indigo-500" />
              </div>
              <p className="text-gray-500 mb-4">No chat history found</p>
              <button
                onClick={startNewSession}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center mx-auto"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Start a new conversation
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedHistory.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <div className="sticky top-0 bg-white py-2 z-10">
                    <h3 className="text-sm font-medium text-gray-500 mb-3 border-b pb-2">
                      {new Date(group.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {group.items.map((item, itemIndex) => {
                      // Show conversation card or detailed view
                      return (
                        <div 
                          key={itemIndex} 
                          className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden bg-white"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 bg-indigo-100 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-medium text-indigo-600">You</p>
                                  <p className="text-gray-700">{item.user_query}</p>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatTime(item.timestamp)}
                              </div>
                            </div>
                            
                            <div className="flex items-start mt-4">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-indigo-100">
                                <img 
                                  src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" 
                                  alt="Star" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-purple-600">Star</p>
                                <p className="text-gray-700">{getPreviewText(item.bot_response)}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 flex justify-between items-center">
                            <button 
                              onClick={() => continueConversation(item.session_id)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Continue this conversation
                            </button>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add delete functionality here
                              }}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Delete conversation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Bottom action bar */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Showing {history.length} conversations
          </p>
          <button 
            onClick={startNewSession}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;