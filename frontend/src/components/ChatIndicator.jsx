// src/components/ChatHeader.jsx
import React from 'react';
import { Info } from 'lucide-react';

const ChatHeader = ({ onToggleTips }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-white shadow-md p-0.5 bg-white">
          <img 
            src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" 
            alt="avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white">
          <h4 className="font-medium text-lg">Star</h4>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
            <p className="text-indigo-100 text-sm">Online | Mental Health Companion</p>
          </div>
        </div>
      </div>
      <button 
        onClick={onToggleTips} 
        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200"
        title="Wellness tips"
      >
        <Info className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatHeader;