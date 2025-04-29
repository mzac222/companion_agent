// src/components/QuickResponses.jsx
import React from 'react';

const QuickResponses = ({ responses, onSelect, disabled }) => {
  return (
    <div className="bg-gray-50 p-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
      <div className="flex space-x-2">
        {responses.map((response, index) => (
          <button
            key={index}
            onClick={() => onSelect(response)}
            disabled={disabled}
            className="px-3 py-1.5 bg-white text-indigo-600 text-sm rounded-full border border-indigo-200 hover:bg-indigo-50 transition whitespace-nowrap flex-shrink-0 shadow-sm"
          >
            {response}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickResponses;