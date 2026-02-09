import { GoogleGenAI, Type } from "@google/genai";

// --- CONFIGURATION ---

const getEnv = (key: string) => {
  let value = '';
  if (import.meta && (import.meta as any).env) {
    value = (import.meta as any).env[`VITE_${key}`] || 
            (import.meta as any).env[`NEXT_PUBLIC_${key}`] || 
            (import.meta as any).env[key] || 
            '';
  }
  if (value) return value;
  if (typeof process !== 'undefined' && process.env) {
    value = process.env[`VITE_${key}`] || 
            process.env[`NEXT_PUBLIC_${key}`] || 
            process.env[key] || 
            '';
  }
  return value;
};

const getGeminiKey = () => getEnv('GEMINI_API_KEY');

const ATLAS_PERSONA = `You are the RateGuard Data Auditor. Your task is to extract bank confirmation data.`;

// --- SIMULATION FALLBACK (Used if API Key missing or Error) ---
const simulateExtraction = async () => {
  console.log("Atlas Simulation: Processing document (Fallback)...");
  await new Promise(resolve => setTimeout(resolve, 1500));

  const banks = ["JPMorgan Chase", "Bank of America", "Wells Fargo", "Citibank"];
  const randomBank = banks[Math.floor(Math.random() * banks.length)];
  const amount = Math.floor(Math.random() * 400000) + 50000;
  const baseRate = 1.08;
  const bankRate = 1.05; // ~2.7% markup

  return {
    extraction: {
      bank_name: randomBank,
      transaction_reference: `SIM-${Date.now().toString().slice(-6)}`,
      sender_name: "Simulated Sender",
      beneficiary_name: "Simulated Beneficiary"
    },
    transaction: {
      original_amount: amount,
      original_currency: "USD",
      converted_amount: amount * bankRate,
      converted_currency: "EUR",
      exchange_rate_bank: bankRate,
      currency_pair: "USD/EUR",
      value_date: new Date().toISOString().split('T')[0]
    },
    fees: {
      items: [{ name: "Wire Fee", amount: 25.00 }],
      total_fees: 25.00
    },
    analysis: {
      mid_market_rate: baseRate,
      cost_of_spread_usd: amount * 0.027,
      total_cost_usd: (amount * 0.027) + 25
    },
    dispute: {
      recommended: true,
      reason: "Simulated High Spread Detected (2.7%)"
    },
    source: 'simulation'
  };
};

// --- GEMINI EXTRACTION PIPELINE ---

export const extractQuoteData = async (base64: string, mimeType: string = 'image/jpeg') => {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    console.warn("Atlas: No API Key found. Using simulation.");
    return simulateExtraction();
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Analyze this bank transaction document (Image/PDF).
    Extract the transaction details into JSON.
    
    Required Fields:
    - bank_name
    - transaction_reference
    - sender_name
    - beneficiary_name
    - original_amount (number)
    - original_currency (ISO code)
    - converted_amount (number)
    - converted_currency (ISO code)
    - exchange_rate_bank (number)
    - currency_pair (Format "BASE/QUOTE")
    - value_date (YYYY-MM-DD)
    - fees (array of {name, amount})
    
    If visual confidence is low, infer based on standard banking formats.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extraction: {
              type: Type.OBJECT,
              properties: {
                bank_name: { type: Type.STRING },
                transaction_reference: { type: Type.STRING },
                sender_name: { type: Type.STRING },
                beneficiary_name: { type: Type.STRING }
              }
            },
            transaction: {
              type: Type.OBJECT,
              properties: {
                original_amount: { type: Type.NUMBER },
                original_currency: { type: Type.STRING },
                converted_amount: { type: Type.NUMBER },
                converted_currency: { type: Type.STRING },
                exchange_rate_bank: { type: Type.NUMBER },
                currency_pair: { type: Type.STRING },
                value_date: { type: Type.STRING }
              }
            },
            fees: {
              type: Type.OBJECT,
              properties: {
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      amount: { type: Type.NUMBER }
                    }
                  }
                },
                total_fees: { type: Type.NUMBER }
              }
            },
            dispute: {
              type: Type.OBJECT,
              properties: {
                 recommended: { type: Type.BOOLEAN },
                 reason: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    const data = JSON.parse(text);
    return { ...data, source: 'gemini-live' };

  } catch (error) {
    console.error("Atlas Extraction Error:", error);
    // Fallback to simulation ensures the UI doesn't break if Gemini is down/quota exceeded
    return simulateExtraction();
  }
};

// --- SUPPORT CHAT ---
export const chatWithAtlas = async (message: string, history: {role: string, parts: {text: string}[]}[] = []) => {
  const apiKey = getGeminiKey();
  if (!apiKey) return "Atlas Disconnected: Missing API Key.";

  const ai = new GoogleGenAI({ apiKey });
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction: ATLAS_PERSONA, temperature: 0.7 },
      history: history 
    });
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    return "Atlas is temporarily unavailable.";
  }
};

// --- IMAGE GEN ---
export const generateImageWithAI = async (prompt: string, size: '1K' | '2K' | '4K') => {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error("Missing Key");
  const ai = new GoogleGenAI({ apiKey });
  const model = (size === '2K' || size === '4K') ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1", ...(model === 'gemini-3-pro-image-preview' ? { imageSize: size } : {}) } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) { throw error; }
};

export const editImageWithAI = async (imageBase64: string, prompt: string) => {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error("Missing Key");
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }, { text: prompt }] }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) { throw error; }
};