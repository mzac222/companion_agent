// src/components/Message.jsx
import React from 'react';

const Message = ({ msg }) => {
  return (
    <div className={`flex ${msg.name === 'User' ? 'justify-end' : 'justify-start'} mb-4`}>
      {msg.name !== 'User' && (
        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-indigo-100">
          <img 
            src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" 
            alt="avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className={`flex flex-col ${msg.name === 'User' ? 'items-end' : 'items-start'}`}>
        <div 
          className={`px-4 py-3 rounded-2xl max-w-xs md:max-w-sm break-words ${
            msg.name === 'User' 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-none' 
              : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'
          }`}
        >
          {msg.message}
        </div>
        <span className="text-xs text-gray-500 mt-1">{msg.timestamp}</span>
      </div>
      {msg.name === 'User' && (
        <div className="w-8 h-8 rounded-full overflow-hidden ml-2 flex-shrink-0 bg-indigo-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Message;