import { useState, useCallback, useMemo } from 'react';
import { analyzeSentiment } from './services/sentimentService';
import { MainSentimentDisplay } from './components/mainSentimentDisplay';
import { LLMSentimentResult } from './types/sentiment';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [sentimentResult, setSentimentResult] =
    useState<LLMSentimentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) {
      setError('No text detected, please enter text');
      setSentimentResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSentimentResult(null);

    const result = await analyzeSentiment(inputText, setError);

    setIsLoading(false);
    if (result) {
      setSentimentResult(result);
    }
  }, [inputText]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };
  const isAnalyzeDisabled = useMemo(
    () => isLoading || inputText.trim().length === 0,
    [isLoading, inputText]
  );

  return (
    <div className='min-h-screen bg-black flex justify-center'>
      <div className='w-full max-w-4xl bg-white rounded-2xl p-6'>
        {/* Header */}
        <header className='text-center mb-10'>
          <h1 className='font-boldtext-gray-900 sm:text-5xl'>
            Sentinel Sentiment Analyzer
          </h1>
        </header>

        {/* Input Area */}
        <section className='bg-gray-50 p-6 rounded-xl shadow-inner'>
          <textarea
            id='text-input'
            rows={6}
            className='w-full p-4 border rounded-xl resize-none text-lg'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
          />
          <div className='flex flex-col sm:flex-row justify-between items-center mt-4 space-y-3 sm:space-y-0'>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzeDisabled}
              className={`w-full sm:w-auto px-8 py-3 rounded-full text-white font-bold tracking-wider text-sm ${
                isAnalyzeDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-[1.01]'
              }`}
            >
              {isLoading ? 'Analyzing...' : 'ANALYZE SENTIMENT'}
            </button>
            <p className='text-sm'>Characters: {inputText.length} / 500</p>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div>
            <span className='font-bold'>Error:</span> {error}
          </div>
        )}

        {/* Results Area */}
        {sentimentResult && <MainSentimentDisplay result={sentimentResult} />}
      </div>
    </div>
  );
};

export default App;
