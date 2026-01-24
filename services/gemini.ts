import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly and ensure initialization follows naming requirements
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractQuoteData = async (imageBase64: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    // Correct multi-part content structure
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
        { text: "Extract freight quote details from this image. Return JSON format including: carrier, origin, destination, weight, totalCost (number), transitTime, and surcharges (array of objects with name and amount)." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          carrier: { type: Type.STRING },
          origin: { type: Type.STRING },
          destination: { type: Type.STRING },
          weight: { type: Type.NUMBER },
          totalCost: { type: Type.NUMBER },
          transitTime: { type: Type.STRING },
          surcharges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["carrier", "origin", "destination", "totalCost"]
      }
    }
  });

  // response.text is a property, not a method
  return JSON.parse(response.text || '{}');
};

export const editImageWithAI = async (imageBase64: string, prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    }
  });

  // Iterate through parts to find the image as per guidelines
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
  }
  return null;
};

export const generateImageWithAI = async (prompt: string, size: '1K' | '2K' | '4K') => {
  // Fresh GoogleGenAI instance right before call for models requiring user-selected keys
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    }
  });

  // Always iterate through all parts to find the image part
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
  }
  return null;
};