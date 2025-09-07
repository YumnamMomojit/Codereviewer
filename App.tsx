import React, { useState, useCallback } from 'react';
import type { CodeReviewFeedback, ReviewHistoryItem } from './types';
import { reviewCode } from './services/geminiService';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import ReviewOutput from './components/ReviewOutput';
import HistorySidebar from './components/HistorySidebar';
import { initialCodeSample } from './constants';

const App: React.FC = () => {
  const [code, setCode] = useState<string>(initialCodeSample);
  const [language, setLanguage] = useState<string>('javascript');
  const [review, setReview] = useState<CodeReviewFeedback | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [reviewHistory, setReviewHistory] = useState<ReviewHistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  const handleReview = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to review.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReview(null);
    try {
      const result = await reviewCode(code, language);
      const newHistoryItem: ReviewHistoryItem = {
        id: Date.now(),
        code,
        language,
        review: result,
        timestamp: new Date().toLocaleString(),
      };
      setReviewHistory(prev => [newHistoryItem, ...prev]);
      setReview(result);
      setSelectedHistoryId(newHistoryItem.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  const handleSelectHistory = useCallback((item: ReviewHistoryItem) => {
    setSelectedHistoryId(item.id);
    setCode(item.code);
    setLanguage(item.language);
    setReview(item.review);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleNewReview = useCallback(() => {
    setSelectedHistoryId(null);
    setCode(initialCodeSample);
    setLanguage('javascript');
    setReview(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <HistorySidebar
          history={reviewHistory}
          onSelect={handleSelectHistory}
          onNewReview={handleNewReview}
          selectedId={selectedHistoryId}
        />
        <main className="flex-grow p-4 lg:p-8 w-full">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <CodeInput
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={setLanguage}
                onReview={handleReview}
                isLoading={isLoading}
                isReadOnly={selectedHistoryId !== null}
              />
            </div>
            <div className="lg:w-1/2">
              <ReviewOutput
                review={review}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
