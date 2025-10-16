import { GoogleGenAI, Type } from "@google/genai";
import { Answers, Recommendation } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPhoneRecommendation = async (answers: Answers): Promise<Recommendation> => {
  try {
    const model = 'gemini-2.5-pro';
    
    const budgetMap: { [key: string]: string } = {
        'under-300': 'Under $300',
        '300-600': '$300 to $600',
        '600-1000': '$600 to $1000',
        'over-1000': 'Over $1000',
    };

    const usageMap: { [key: string]: string } = {
        'photography': 'Photography',
        'gaming': 'Gaming',
        'business': 'Business & Productivity',
        'everyday': 'Everyday Use',
    };

    const prompt = `
      You are Ria, an expert mobile phone recommender with an elegant and minimalist style.
      A user has provided their preferences:
      - Budget: ${budgetMap[answers.budget || '']}
      - Primary Usage: ${usageMap[answers.usage || '']}

      Based on these, recommend one specific mobile phone that is currently available on the market.
      Find a high-quality, publicly accessible image URL for the recommended phone.
      Provide your response in a JSON format. The JSON object must contain three keys:
      1. "phoneName": The full, official name of the recommended phone (e.g., "Google Pixel 9 Pro").
      2. "reason": A single, concise sentence explaining why this phone is a perfect fit for the user's needs and budget. Your tone should be helpful, sophisticated, and direct.
      3. "imageUrl": A direct, publicly accessible URL to a high-quality image of the phone.
    `;

    const recommendationResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            phoneName: {
              type: Type.STRING,
              description: "The full name of the recommended phone."
            },
            reason: {
              type: Type.STRING,
              description: "A single, concise sentence explaining the recommendation."
            },
            imageUrl: {
              type: Type.STRING,
              description: "A publicly accessible URL for an image of the phone."
            }
          }
        }
      }
    });

    // Fix: Added .trim() to robustly handle potential whitespace in the API response before parsing JSON.
    const recommendationResult = JSON.parse(recommendationResponse.text.trim());

    return {
      phoneName: recommendationResult.phoneName,
      reason: recommendationResult.reason,
      imageUrl: recommendationResult.imageUrl
    };

  } catch (error) {
    console.error("Error getting recommendation from Gemini API:", error);
    throw new Error("Failed to get recommendation. Please try again later.");
  }
};