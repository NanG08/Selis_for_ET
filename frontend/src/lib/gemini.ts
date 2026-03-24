import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn('VITE_GEMINI_API_KEY is not set in .env file');
}
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export async function askSelisAI(prompt: string, context: any) {
  const model = "gemini-3-flash-preview";
  const getPlanFocus = (plan: string) => {
    switch (plan) {
      case 'personal':
        return "Focus on lifestyle budgeting, subscription management, and personal goals. Example: 'You overspent on dining this week' or 'Cancel these 3 unused subscriptions'.";
      case 'family':
        return "Focus on member-specific spending, shared goals, and allowance tracking. Example: 'Priya is 90% through her budget' or 'Shared household expenses are up 10%'.";
      case 'freelancer':
        return "Focus on income smoothing, tax estimation, and invoice follow-ups. Example: 'Your income is variable, set aside 15k for next month' or 'Invoice #102 is 5 days overdue'.";
      case 'small_business':
        return "Focus on cash flow runway, GST credits, and vendor payments. Example: 'Your runway is 4 months' or 'You have 34k in unclaimed GST input credit'.";
      case 'enterprise':
        return "Focus on budget adherence, policy enforcement, and departmental variance. Example: 'Marketing dept is 15% over travel policy' or 'Approval bottleneck in HR'.";
      default:
        return "Provide general financial advice.";
    }
  };

  const systemInstruction = `You are Sally, a financial assistant for Selis. 
  You provide concise, helpful financial advice based on the user's plan (${context.plan}) and financial data.
  Plan Focus: ${getPlanFocus(context.plan)}
  Keep responses under 120 words. Be conversational but professional.
  User context: ${JSON.stringify(context.data)}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
}
