
import React from 'react';
import type { CodeReviewFeedback, FeedbackItem } from '../types';
import Loader from './Loader';

interface ReviewOutputProps {
  review: CodeReviewFeedback | null;
  isLoading: boolean;
  error: string | null;
}

const BugIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 9c1.9 0.2 3.5 1.9 3.5 4"/><path d="M18 13h4"/><path d="M21 21c0-2.1-1.7-3.9-3.8-4"/></svg>
);
const StyleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 3-3 3 3"/><path d="m9 9 3 3 3-3"/></svg>
);
const BestPracticeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

const FeedbackSection: React.FC<{ title: string; items: FeedbackItem[]; icon: React.ReactNode }> = ({ title, items, icon }) => {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center">{icon}{title}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="bg-gray-700/50 p-4 rounded-md border-l-4 border-gray-600">
            {item.line !== -1 && (
              <p className="text-xs font-mono text-teal-400 mb-1">Line: {item.line}</p>
            )}
            <p className="text-gray-300">{item.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ReviewOutput: React.FC<ReviewOutputProps> = ({ review, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full"><Loader /></div>;
    }
    if (error) {
      return <div className="bg-red-900/50 text-red-300 p-4 rounded-lg border border-red-700">{error}</div>;
    }
    if (!review) {
      return (
        <div className="text-center text-gray-500 h-full flex items-center justify-center">
          <p>Your code review will appear here.</p>
        </div>
      );
    }
    return (
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Overall Assessment</h3>
          <p className="bg-gray-700/50 p-4 rounded-md text-gray-300">{review.overall_assessment}</p>
        </div>
        <FeedbackSection title="Potential Bugs" items={review.potential_bugs} icon={<BugIcon />} />
        <FeedbackSection title="Style Suggestions" items={review.style_suggestions} icon={<StyleIcon />} />
        <FeedbackSection title="Best Practices" items={review.best_practices} icon={<BestPracticeIcon />} />
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Review Feedback</h2>
      <div className="bg-gray-900 p-4 rounded-md h-[calc(100%-40px)] min-h-[500px] overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default ReviewOutput;
