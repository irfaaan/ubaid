import OpenAI from "openai";
import { 
  Phone, 
  RecommendationRequest, 
  RecommendationResponse, 
  PhoneRecommendation 
} from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AIRecommendationResponse {
  bestMatch: {
    model: string;
    match: number;
    reasons: string[];
  };
  alternatives: {
    model: string;
    match: number;
    reasons: string[];
  }[];
}

export async function getPhoneRecommendations(
  request: RecommendationRequest,
  availablePhones: Phone[]
): Promise<RecommendationResponse> {
  try {
    // Construct a prompt for the AI
    const prompt = `
As an AI expert in Samsung phones, recommend the best Galaxy phone for a user with these preferences:

Current phone: ${request.currentPhone}
Current storage: ${request.currentStorage}
Usage type: ${request.usageType}
Budget: $${request.budget}
Priorities: ${request.priorities.join(', ')}

Here are the available phones within budget (all prices in USD):
${availablePhones.map(phone => `
- ${phone.model}: $${phone.price}
  Display: ${phone.displaySize}, ${phone.displayType}
  Processor: ${phone.processor}
  Camera: ${phone.mainCamera}
  Battery: ${phone.battery}
  RAM: ${phone.ram}
  Storage: ${phone.storageOptions}
  Key features: ${phone.features}
`).join('')}

Based on the user's preferences, give me the single best match and 2 alternative recommendations. 
For each recommendation, include a match percentage (0-100) and specific reasons why it's a good match for this user.

Respond in this exact JSON format:
{
  "bestMatch": {
    "model": "Galaxy model name",
    "match": number between 0-100,
    "reasons": ["reason 1", "reason 2", "reason 3"]
  },
  "alternatives": [
    {
      "model": "Galaxy model name",
      "match": number between 0-100,
      "reasons": ["reason 1", "reason 2"]
    },
    {
      "model": "Galaxy model name",
      "match": number between 0-100,
      "reasons": ["reason 1", "reason 2"]
    }
  ]
}
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const aiRecommendations = JSON.parse(content) as AIRecommendationResponse;

    // Map AI recommendations to phone objects
    const bestMatchPhone = availablePhones.find(
      phone => phone.model === aiRecommendations.bestMatch.model
    );

    if (!bestMatchPhone) {
      throw new Error(`Cannot find best match phone: ${aiRecommendations.bestMatch.model}`);
    }

    const bestMatch: PhoneRecommendation = {
      phone: bestMatchPhone,
      match: aiRecommendations.bestMatch.match,
      reasons: aiRecommendations.bestMatch.reasons,
    };

    // Map alternative recommendations
    const alternatives: PhoneRecommendation[] = [];
    
    for (const alt of aiRecommendations.alternatives) {
      const altPhone = availablePhones.find(phone => phone.model === alt.model);
      if (altPhone) {
        alternatives.push({
          phone: altPhone,
          match: alt.match,
          reasons: alt.reasons,
        });
      }
    }

    // Add trade-in value if requested
    if (request.includeTradeIn && request.currentPhone) {
      // In a real app, this would come from a database or external API
      // For now, we'll use simplified values
      const tradeInValues: Record<string, number> = {
        "Samsung Galaxy S23": 350,
        "Samsung Galaxy S22": 250,
        "Samsung Galaxy S21": 200,
        "Samsung Galaxy A54": 150,
        "Samsung Galaxy A53": 100,
        "Samsung Galaxy Note 20": 200,
        "Other Samsung": 100,
        "Other Brand": 50
      };

      const tradeInValue = tradeInValues[request.currentPhone] || 0;
      
      bestMatch.tradeInValue = tradeInValue;
      alternatives.forEach(alt => {
        alt.tradeInValue = tradeInValue;
      });
    }

    return {
      bestMatch,
      alternatives
    };
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    throw new Error(`Failed to get AI recommendations: ${(error as Error).message}`);
  }
}
