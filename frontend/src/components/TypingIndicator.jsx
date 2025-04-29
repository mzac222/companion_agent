// src/components/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-indigo-100">
        <img 
          src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" 
          alt="avatar" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-none border border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;