import React from 'react';
import { LLMSentimentResult } from '../types/sentiment';

interface MainSentimentDisplayProps {
  result: LLMSentimentResult;
}

export const MainSentimentDisplay: React.FC<MainSentimentDisplayProps> = ({
  result,
}) => {
  const compound = result.compoundScore;

  const compoundPercentage = Math.round(Math.abs(compound) * 100);
  const compoundDirection = result.sentiment;

  return (
    <div>
      <div>
        <div>
          <p>Model Rationale:</p>
          <p>{result.explanation}</p>
          <div>
            <br></br>
            <div>
              <p>
                A score of{' '}
                <span className='font-bold'>{compound.toFixed(4)}</span> means
                the text is classified as {compoundPercentage}%{' '}
                {compoundDirection}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
