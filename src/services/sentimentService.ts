import { API_URL, GENERATION_CONFIG, MAX_RETRIES } from '../constants/api.ts';
import { LLMSentimentResult } from '../types/sentiment.ts';

export const analyzeSentiment = async (
  inputText: string,
  setError: (error: string) => void
): Promise<LLMSentimentResult | null> => {
  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Analyze the sentiment of the following text: "${inputText}"`,
          },
        ],
      },
    ],
    generationConfig: GENERATION_CONFIG,
  };

  let finalResult = null;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    attempts++;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const result = await response.json();
      // this allows us to access the different properties of the responseSchema of GENERATION_CONFIG
      const jsonText = result.candidates?.[0].content?.parts?.[0].text;

      if (jsonText) {
        // replaces leading and trailing whitespaces respectively
        const cleanedJsonText = jsonText
          .replace(/^```json\s*/, '')
          .replace(/\s*```$/, '');

        const parsedJson = JSON.parse(cleanedJsonText);

        if (
          typeof parsedJson.sentiment !== 'string' ||
          typeof parsedJson.compoundScore !== 'number'
        ) {
          throw new Error(`API returned valid JSON but incorrect types`);
        }

        finalResult = parsedJson as LLMSentimentResult;
        break;
      } else {
        throw new Error(`Received empty response from API`);
      }
    } catch (e) {
      console.error(`Attempt ${attempts} failed:`, e);
      if (attempts > MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        setError(`Analysis failed after 3 attempts.`);
      }
    }
  }
  return finalResult;
};
