export const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || '';
export const MODEL_NAME = 'gemini-2.5-flash';
export const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
export const MAX_RETRIES = 3;

export const GENERATION_CONFIG = {
  responseMimeType: 'application/json',
  responseSchema: {
    type: 'OBJECT',
    properties: {
      sentiment: {
        type: 'STRING',
        description: 'The primary sentiment: Positive, Negative, or Neutral.',
        enum: ['Positive', 'Negative', 'Neutral'],
      },
      compoundScore: {
        type: 'NUMBER',
        description:
          'A numerical score between -1 and 1, where -1 is highly negative, 0 is neutral, and 1 is highly positive.',
      },
      explanation: {
        type: 'STRING',
        description:
          'Two to three sentences depending on the length of the text explaining the reasoning for the sentiment classification.',
      },
    },
    required: ['sentiment', 'compoundScore', 'explanation'],
  },
};
