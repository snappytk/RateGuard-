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

// --- SIMULATION PIPELINE ---

export const extractQuoteData = async (base64: string, mimeType: string = 'image/jpeg') => {
  console.log("Atlas Simulation: Processing document...");
  
  // Simulate network/processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate randomized but realistic data
  const banks = ["JPMorgan Chase", "Bank of America", "Wells Fargo", "Citibank", "HSBC", "Deutsche Bank"];
  const randomBank = banks[Math.floor(Math.random() * banks.length)];
  
  const pairs = ["USD/EUR", "USD/GBP", "USD/JPY", "USD/CAD"];
  const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
  
  const amount = Math.floor(Math.random() * 400000) + 50000; // 50k - 450k
  
  // Base rates for sim
  const baseRates: Record<string, number> = { "USD/EUR": 0.92, "USD/GBP": 0.79, "USD/JPY": 151.50, "USD/CAD": 1.36 };
  const baseRate = baseRates[randomPair] || 1.0;
  
  // Simulate a bad bank rate (2-3% markup)
  const markup = 1.0 + (0.02 + Math.random() * 0.015);
  const bankRate = randomPair.includes('JPY') ? baseRate * (1/markup) : baseRate * (1/markup); // Simplify for direction
  
  // For the purpose of the UI showing "Markup", we usually compare Bank Rate vs Mid Market.
  // If I sell USD to buy EUR, Bank gives me LESS EUR per USD.
  // Mid Market: 0.92 EUR/USD. Bank gives 0.90 EUR/USD.
  const exchangeRateBank = parseFloat((baseRate * 0.975).toFixed(4)); 

  const estimatedSpreadCost = amount * 0.025; // Approx 2.5%

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
      converted_amount: amount * exchangeRateBank,
      converted_currency: randomPair.split('/')[1],
      exchange_rate_bank: exchangeRateBank,
      currency_pair: randomPair,
      value_date: new Date().toISOString().split('T')[0]
    },
    fees: {
      items: [{ name: "Wire Fee", amount: 25.00 }, { name: "Processing", amount: 15.00 }],
      total_fees: 40.00
    },
    analysis: {
      mid_market_rate: baseRate,
      cost_of_spread_usd: Number(estimatedSpreadCost.toFixed(2)),
      total_cost_usd: Number((estimatedSpreadCost + 40).toFixed(2))
    },
    dispute: {
      recommended: true,
      reason: "Simulated High Spread Detected (2.5%)"
    },
    source: 'simulation'
  };
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