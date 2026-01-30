import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScriptItem } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please select an API key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateOpicQuestion = async (): Promise<string> => {
  const ai = getAiClient();
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Generate a common OPIc interview question.
    Suitable for IH to AL level. Focus on work, hobbies, or past experiences.
    Return ONLY the question in English.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text?.trim() || "Tell me about your typical workday.";
};

export const generateKoreanSamples = async (question: string, masteredScripts: ScriptItem[]): Promise<{ samples: string[] }> => {
  const ai = getAiClient();
  const model = "gemini-3-flash-preview";

  const masteredContext = masteredScripts.length > 0 
    ? `The student is comfortable with these structures: ${masteredScripts.map(s => s.englishScript.slice(0, 50)).join(", ")}`
    : "";

  const prompt = `
    Question: "${question}"
    Provide 3 natural Korean sample answers. 
    ${masteredContext}
    Try to suggest content that could use similar sentence structures the student already knows.
    Return JSON: { "samples": ["sample1", "sample2", "sample3"] }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          samples: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text || '{"samples": []}');
};

export const generateEnglishScripts = async (koreanText: string): Promise<{ 
  scripts: { label: string, text: string, logicFlow: string[] }[] 
}> => {
  const ai = getAiClient();
  const model = "gemini-3-flash-preview";

  const prompt = `
    Korean Answer: "${koreanText}"
    Create 3 English versions (Simple, Natural, Detailed).
    For each, also provide a "logicFlow": a list of 4-5 short English keywords representing the structural steps of the answer.
    Return JSON structure.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      scripts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            text: { type: Type.STRING },
            logicFlow: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["label", "text", "logicFlow"]
        }
      }
    }
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  return JSON.parse(response.text || '{"scripts": []}');
};

export const extractCommonPatterns = async (scripts: ScriptItem[]): Promise<{ patterns: { pattern: string, explanation: string, example: string }[] }> => {
  if (scripts.length === 0) return { patterns: [] };
  
  const ai = getAiClient();
  const model = "gemini-3-flash-preview";

  const scriptsText = scripts.map(s => s.englishScript).join("\n---\n");
  const prompt = `
    Analyze these OPIc scripts and extract 3 recurring useful sentence patterns or idioms.
    Scripts:
    ${scriptsText}
    
    Return JSON: { "patterns": [ { "pattern": "...", "explanation": "...", "example": "..." } ] }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          patterns: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pattern: { type: Type.STRING },
                explanation: { type: Type.STRING },
                example: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '{"patterns": []}');
};