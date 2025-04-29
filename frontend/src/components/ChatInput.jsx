// src/components/ChatInput.jsx
import React, { useState, useRef } from 'react';

const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  onKeyPress, 
  disabled,
  showEmojis,
  onToggleEmoji,
  onAddEmoji
}) => {
  const inputRef = useRef(null);

  return (
    <div className="border-t border-gray-200 p-3 bg-white flex items-center">
      <button 
        onClick={onToggleEmoji}
        className="text-gray-400 hover:text-indigo-500 mr-2 transition-colors"
        title="Add emoji"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      <div className="flex-1 bg-gray-100 rounded-lg flex items-center px-3 focus-within:ring-2 focus-within:ring-indigo-300 focus-within:bg-white transition-all">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder="Type your message here..."
          className="flex-1 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          disabled={disabled}
        />
        {value.trim() !== '' && (
          <button 
            onClick={() => onChange({ target: { value: '' } })}
            className="text-gray-400 hover:text-gray-600 ml-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <button 
        onClick={onSend}
        disabled={disabled || value.trim() === ''}
        className={`ml-2 rounded-full w-12 h-12 flex items-center justify-center transition-all ${
          disabled || value.trim() === '' 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:opacity-90'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;