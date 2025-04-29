// src/components/MessageList.jsx
import React from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ messages, isLoading }) => {
  return (
    <div className="flex-grow overflow-y-auto h-[100vh] p-4 bg-gradient-to-b from-gray-50 to-white" style={{ maxHeight: '400px' }}>
      {messages.map((msg, index) => (
        <Message key={index} msg={msg} />
      ))}
      
      {isLoading && <TypingIndicator />}
    </div>
  );
};

export default MessageList;