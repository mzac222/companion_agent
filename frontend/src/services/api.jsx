// services/api.js
export const sendMessage = async (message, sessionId, userId) => {
  try {
    const response = await fetch(`/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        session_id: sessionId,
        user_id: userId 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.message || 'Network error. Please try again.');
  }
};

export const getChatHistory = async (userId) => {
  try {
    const response = await fetch(`/api/sessions?user_id=${userId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch history');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.message || 'Network error. Please try again.');
  }
};

export const getChatById = async (chatId, userId) => {
  try {
    const response = await fetch(`/api/sessions/${chatId}?user_id=${userId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch chat with ID ${chatId}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data); // Add this for debugging
    
    // Ensure the response has the expected structure
    if (!data.chat) {
      throw new Error('Invalid chat data structure');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Re-throw the error to handle it in the component
  }
};