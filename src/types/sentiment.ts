export interface LLMSentimentResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  compoundScore: number;
  explanation: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: LLMSentimentResult | null;
}
