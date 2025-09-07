import React from 'react';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  onReview: () => void;
  isLoading: boolean;
  isReadOnly: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({
  code,
  setCode,
  language,
  setLanguage,
  onReview,
  isLoading,
  isReadOnly,
}) => {
  const languages = ['javascript', 'python', 'typescript', 'java', 'csharp', 'go', 'rust', 'html', 'css'];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">Your Code</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isReadOnly}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-40 p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-grow">
         <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            readOnly={isReadOnly}
            placeholder="Paste your code here..."
            className="w-full h-full min-h-[400px] bg-gray-900 text-gray-200 p-4 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm resize-none"
        />
      </div>
      <button
        onClick={onReview}
        disabled={isLoading || isReadOnly}
        className="mt-4 w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
      >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
            </>
        ) : (
          'Review Code'
        )}
      </button>
    </div>
  );
};

export default CodeInput;
