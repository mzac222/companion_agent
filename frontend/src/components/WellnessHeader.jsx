// src/components/WellnessTipBanner.jsx
import React from 'react';
import { Lightbulb, X } from 'lucide-react';

const WellnessTipBanner = ({ tip, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border-b border-indigo-100 flex items-start">
      <div className="text-indigo-600 mr-2 mt-0.5">
        <Lightbulb className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-indigo-800 font-medium">Today's Wellness Tip</p>
        <p className="text-xs text-indigo-600">{tip}</p>
      </div>
      <button 
        onClick={onClose}
        className="text-indigo-400 hover:text-indigo-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default WellnessTipBanner;