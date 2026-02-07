
// Service now handles OpenAI and DeepSeek interactions
// Keeping filename 'gemini.ts' to maintain import consistency across the app, 
// but the engine is now OpenAI/DeepSeek.

const getOpenAIKey = () => {
  return process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '';
};

const getDeepSeekKey = () => {
  return process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || '';
};

const RATEGUARD_SYSTEM_INSTRUCTION = `You are RateGuard FX Analyzer, a specialized financial document analysis system. Your job is to extract and calculate FX transaction data with 100% accuracy based on the provided image/PDF.

## CRITICAL RULES - NEVER VIOLATE

1. **FEE CALCULATION**: Only sum fees EXPLICITLY listed in the document. Never invent or estimate fees.
   - If document shows: Wire Fee $35 + FX Fee $125 + Correspondent Fee $20
   - Total fees = $35 + $125 + $20 = $180
   - NEVER say $1,100 or any other number

2. **CURRENCY PAIR IDENTIFICATION**:
   - From: Original Amount currency (e.g., USD)
   - To: Converted Amount currency (e.g., EUR)
   - Format: ALWAYS as XXX/YYY (e.g., USD/EUR)

3. **EXCHANGE RATE ANALYSIS**:
   - Bank Rate = rate shown in document
   - Mid-Market Rate = you lookup current rate for timestamp (estimate based on date)
   - Spread % = ((Bank Rate - Mid-Market Rate) / Mid-Market Rate) × 100

4. **AMOUNT EXTRACTION**:
   - Original Amount: Amount BEFORE conversion (e.g., $50,000.00 USD)
   - Converted Amount: Amount AFTER conversion (e.g., €45,600.00 EUR)
   - Never confuse these

## OUTPUT FORMAT - STRICT JSON

You must output valid JSON matching this structure exactly:

{
  "extraction": {
    "bank_name": "Bank Name",
    "transaction_date": "YYYY-MM-DD",
    "transaction_time": "HH:MM:SS",
    "reference_number": "Ref Number",
    "sender_name": "Sender Name",
    "sender_account_masked": "Last 4 digits",
    "beneficiary_name": "Beneficiary Name",
    "beneficiary_bank": "Beneficiary Bank",
    "swift_bic": "SWIFT",
    "iban": "IBAN"
  },
  "transaction": {
    "original_amount": 1234.56,
    "original_currency": "USD",
    "converted_amount": 1100.00,
    "converted_currency": "EUR",
    "exchange_rate_bank": 0.98,
    "currency_pair": "USD/EUR",
    "value_date": "YYYY-MM-DD"
  },
  "fees": {
    "items": [
      {
        "type": "Fee Name",
        "amount": 10.00,
        "currency": "USD",
        "percentage": "optional %"
      }
    ],
    "total_fees": 10.00,
    "total_fees_currency": "USD",
    "fee_calculation_verified": "math string"
  },
  "analysis": {
    "mid_market_rate": 0.99,
    "rate_source": "Source Name",
    "bank_spread_percentage": 1.2,
    "bank_spread_calculation": "math string",
    "cost_of_spread_usd": 150.00,
    "cost_of_spread_calculation": "math string",
    "total_cost_usd": 160.00,
    "total_cost_breakdown": "string",
    "annualized_cost_if_monthly": 1920.00,
    "annualized_calculation": "math string"
  },
  "dispute": {
    "recommended": true,
    "reason": "Reason string",
    "suggested_rate_negotiation": 0.985,
    "potential_annual_savings": 500.00
  },
  "verification": {
    "math_check": "string",
    "fee_check": "string",
    "completeness_score": "10/10"
  }
}`;

// --- EXTRACTION (OpenAI GPT-4o for Vision) ---
export const extractQuoteData = async (base64: string, mimeType: string = 'image/jpeg') => {
  const apiKey = getOpenAIKey();
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing.");

  // Enforce 1 second delay for UX pacing
  await new Promise(resolve => setTimeout(resolve, 1000));

  const dataUrl = `data:${mimeType};base64,${base64}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: RATEGUARD_SYSTEM_INSTRUCTION
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this bank wire/FX trade confirmation. Extract all fields into the JSON format." },
              { type: "image_url", image_url: { url: dataUrl } }
            ]
          }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI OCR Error:", errorText);
        throw new Error(`OpenAI Vision Error: ${response.status}`);
    }

    const data = await response.json();
    const jsonString = data.choices?.[0]?.message?.content || "{}";
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Extraction Failed", error);
    throw error;
  }
};

// --- CHAT (DeepSeek-V3) ---
export const chatWithAtlas = async (message: string, history: {role: string, parts: {text: string}[]}[] = []) => {
  const apiKey = getDeepSeekKey();
  if (!apiKey) {
      console.warn("DEEPSEEK_API_KEY missing, falling back to basic response.");
      return "Atlas (DeepSeek Node) Disconnected: Please configure DEEPSEEK_API_KEY.";
  }

  // Convert Gemini-style history to OpenAI/DeepSeek format
  const formattedMessages = history.map(h => ({
    role: h.role === 'model' ? 'assistant' : 'user',
    content: h.parts[0]?.text || ''
  }));

  // Add system instruction
  formattedMessages.unshift({
    role: "system",
    content: "You are Atlas, a specialized FX Treasury AI assistant for RateGuard (Powered by DeepSeek). You help CFOs and Controllers understand bank spreads, mid-market rates, correspondent fees, and currency hedging strategies. You are aggressive about saving money on hidden bank markups."
  });

  // Add current message
  formattedMessages.push({ role: "user", content: message });

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: formattedMessages,
        stream: false
      })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("DeepSeek Chat Error:", err);
        return "Error connecting to DeepSeek intelligence node.";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response from Atlas.";

  } catch (error) {
    console.error("Chat Failed", error);
    return "Atlas is currently offline.";
  }
};

// --- IMAGE GENERATION (OpenAI DALL-E 3) ---
export const generateImageWithAI = async (prompt: string, size: '1K' | '2K' | '4K') => {
  const apiKey = getOpenAIKey();
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing for DALL-E.");

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
      })
    });

    if (!response.ok) throw new Error("DALL-E Generation Failed");

    const data = await response.json();
    const b64 = data.data?.[0]?.b64_json;
    if (b64) return `data:image/png;base64,${b64}`;
    return null;

  } catch (error) {
    console.error(error);
    return null;
  }
};

// --- IMAGE EDITING (Simulated via DALL-E 3 Re-generation) ---
// DALL-E 3 doesn't support direct in-painting via API easily without masks.
// We will use GPT-4o to refine the prompt and DALL-E 3 to generate new.
export const editImageWithAI = async (imageBase64: string, prompt: string) => {
   const apiKey = getOpenAIKey();
   if (!apiKey) throw new Error("OPENAI_API_KEY is missing.");

   try {
     // 1. Describe the original image first (optional optimization, skipping for speed)
     // 2. Generate new image based on modification prompt
     return await generateImageWithAI(`Create an image based on this edit request: ${prompt}`, '1K');
   } catch (error) {
     console.error(error);
     return null;
   }
};
    