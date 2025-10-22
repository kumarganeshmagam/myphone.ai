import { GoogleGenAI } from "@google/genai";
import { Answers, Recommendation } from '../types';
import { QUESTIONS } from "../data/questionnaireData";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT = `
You are PrasadTechIntelugu, an expert mobile phone reviewer and recommender. Your goal is to recommend the single best mobile phone available in India for a user based on their answers, using a deterministic, multi-step chain-of-thought process.

**Chain of Thought & Reasoning Rules:**

1.  **Initial Scan & Budget Filtering**:
    *   First, use Google Search to find a list of recently launched and popular mobile phones currently available in India.
    *   From this list, create a shortlist of phones that fall within the user's specified budget range (consider a buffer of ±₹5,000).
    *   **Fallback Search**: If no recently launched phones are a strong match after initial filtering, expand your search to include popular models from the previous generation that are still available for purchase and meet the budget criteria.

2.  **Battery Performance Deep Dive (Critical Filter)**:
    *   Analyze the user's \`avgScreenTime\`. Interpret it as how user using this mobile and what power he might need to decide on the mah capacity.
    *   Use Google Search to perform a deep dive on the battery performance of the shortlisted phones. Look for real user reviews on Amazon.in and Flipkart.com specifically mentioning battery life and screen-on-time.
    *   **Immediately eliminate** any phones that have poor real-world battery reviews or clearly cannot meet the user's screen time needs, regardless of their other specs.

3.  **Holistic Feature Analysis & Iterative Refinement**:
    *   With the remaining battery-vetted phones, perform a holistic evaluation against **all** user preferences using the following weightage:
        *   Primary Usage: 10%
        *   Processor Preference: 15%
        *   Camera Quality: 15%
        *   OS Preference: 10%
        *   Display Size: 2.5%
        *   Weight: 2.5%
        *   Sound Quality: 5%
        *   Charging Type: 2.5%
        *   AI Features: 2.5%
    *   Ensure the top contenders align with all user preferences. For example, if a phone is strong in performance but fails on a required OS (e.g., user wants iOS), it must be disqualified.
    *   Iteratively refine your list down to the top 1-3 contenders.

4.  **Final Verification & Issue Check**:
    *   For the final contenders, perform one last verification search. Look for any widespread, deal-breaking issues reported by users (e.g., overheating, software bugs, poor service).
    *   This step is crucial to ensure the recommended phone is reliable in the long term.

5.  **Price Comparison & Final Selection**:
    *   Select the single best phone that provides the most value and best matches all of the user's needs.
    *   Use Google Search to find the current price for this phone on both Amazon.in and Flipkart.com.
    *   Identify which platform offers the phone for a cheaper price, considering current discounts.

**Output Format:**

*   You MUST provide your final output ONLY in a raw, minified JSON format. Do not include markdown, comments, or any other text outside the JSON object.
*   The JSON object must have these keys:
  *   "phoneName": string (Official full name)
  *   "reason": string (A very concise, one-sentence explanation of why it's the best fit for the user, based on your verification.)
  *   "imageUrl": string (A publicly accessible, high-quality image URL of the phone.)
  *   "officialUrl": string (The official product page URL.)
  *   "productUrl": string (The URL for the product page from either Amazon.in or Flipkart.com, whichever is cheaper.)
  *   "storeName": string ("Amazon.in" or "Flipkart.com", corresponding to the productUrl.)
`;


const formatAnswersForPrompt = (answers: Answers): string => {
  let formatted = 'A user has provided their preferences:\n';
  for (const question of QUESTIONS) {
    const answer = answers[question.id];
    if (answer !== undefined && answer !== '' && (!Array.isArray(answer) || answer.length > 0)) {
      formatted += `- ${question.label}: `;
      if (Array.isArray(answer)) {
        const labels = answer.map(val => question.options?.find(opt => opt.value === val)?.label || val);
        formatted += labels.join(', ');
      } else if (question.options) {
        formatted += question.options.find(opt => opt.value === answer)?.label || answer;
      } else {
        formatted += answer;
      }
      formatted += '\n';
    }
  }
  return formatted;
};

export const getPhoneRecommendation = async (answers: Answers, isRetry: boolean = false): Promise<Recommendation> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const userPrompt = formatAnswersForPrompt(answers);
    let fullPrompt = `${userPrompt}\nBased on these, recommend one specific mobile phone. Follow the instructions in the system prompt precisely.`;

    if (isRetry) {
      fullPrompt += "\n\n**Re-evaluation Request:** You have provided a recommendation before for these same preferences. The user wants you to try again. Please re-evaluate your previous choice. Cross-check it against other strong competitors in the same price and feature range. Scrutinize your reasoning and ensure you haven't missed a better alternative. Provide the single best recommendation, even if it's different from before.";
    }

    const recommendationResponse = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{googleSearch: {}}],
      }
    });

    const responseText = recommendationResponse.text.trim();
    
    // Robustly find and parse JSON from the response text.
    // This handles cases where the model might add introductory text before the JSON object.
    const jsonStartIndex = responseText.indexOf('{');
    const jsonEndIndex = responseText.lastIndexOf('}');

    if (jsonStartIndex !== -1 && jsonEndIndex > jsonStartIndex) {
      const jsonString = responseText.substring(jsonStartIndex, jsonEndIndex + 1);
      try {
        const recommendationResult = JSON.parse(jsonString);
        return recommendationResult;
      } catch (parseError) {
        console.error("Failed to parse extracted JSON string:", jsonString, parseError);
        throw new Error("Failed to parse recommendation. The model's response was malformed.");
      }
    }
    
    console.error("Could not find a valid JSON object in the model's response:", responseText);
    throw new Error("Failed to get recommendation. The model returned an unexpected format.");

  } catch (error) {
    console.error("Error getting recommendation from Gemini API:", error);
    // Re-throw a user-friendly error. The specific error is already logged.
    throw new Error("Sorry, we couldn't get a recommendation right now. Please try again.");
  }
};