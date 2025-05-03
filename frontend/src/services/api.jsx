

export const sendMessage = async (message) => {
  try {
    const response = await fetch(`/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
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

export const getChatHistory = async () => {
  try {
    const response = await fetch(`/api/history`);
    
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

// Add this function to your services/api.js file
export const getChatById = async (chatId) => {
    try {
      const response = await fetch(`/api/sessions/${chatId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch chat with ID ${chatId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.message || 'Network error. Please try again.');
    }
  };