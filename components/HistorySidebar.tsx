import React from 'react';
import type { ReviewHistoryItem } from '../types';

interface HistorySidebarProps {
  history: ReviewHistoryItem[];
  onSelect: (item: ReviewHistoryItem) => void;
  onNewReview: () => void;
  selectedId: number | null;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onNewReview, selectedId }) => {
  return (
    <aside className="w-full lg:w-72 bg-gray-800 p-4 flex flex-col lg:h-screen lg:sticky top-0 border-r border-gray-700 flex-shrink-0">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">History</h2>
      <button
        onClick={onNewReview}
        className={`w-full text-left p-3 rounded-lg mb-4 transition-colors duration-200 text-white font-semibold ${
          selectedId === null ? 'bg-teal-600' : 'bg-gray-700 hover:bg-gray-600'
        }`}
        aria-current={selectedId === null}
      >
        + New Review
      </button>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm p-3">Your review history will appear here.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    selectedId === item.id ? 'bg-teal-800/80 text-white' : 'hover:bg-gray-700/70'
                  }`}
                  aria-current={selectedId === item.id}
                >
                  <p className="font-mono text-sm truncate font-semibold text-teal-300">{item.language}</p>
                  <p className="text-xs text-gray-300 truncate mt-1">{item.code.split('\\n')[0]}</p>
                  <p className="text-xs text-gray-500 mt-2">{item.timestamp}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default HistorySidebar;
