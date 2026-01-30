import { GoogleGenAI, Type } from "@google/genai";
import { ScriptItem, VocabItem, StructureItem } from "../types";

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
  
  const topics = [
    "Hobbies (Music, Movies, Parks)",
    "Daily Life (Home, Grocery, Routine)",
    "Past Experiences (Memorable trip, Childhood)",
    "Roleplay (Calling a travel agency, Booking a hotel)",
    "Comparison (Past vs Present technology, Different types of houses)",
    "Problems/Situations (Lost phone, Broken appliance)"
  ];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `
    Generate a highly realistic OPIc (Oral Proficiency Interview - computer) question.
    Category: ${randomTopic}.
    Level: IH to AL target.
    Provide the question exactly as an interviewer would say it in English.
    Return ONLY the question text.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text?.trim() || "Tell me about the house you lived in as a child.";
};

export const generateVocabList = async (): Promise<VocabItem[]> => {
  const ai = getAiClient();
  const model = "gemini-3-flash-preview";
  // Requesting exactly 30 items as requested by user
  const prompt = `Generate a list of 30 high-frequency OPIc vocabulary items, idioms, or colloquial expressions (e.g., "breathtaking", "get some fresh air", "hit the gym", "a stone's throw away"). 
  Return as JSON object with a "vocabs" array containing objects with "word" (English) and "meaning" (Korean).
  Make sure they are diverse and suitable for an IH/AL target level.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vocabs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                meaning: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  const data = JSON.parse(response.text || '{"vocabs":[]}');
  return data.vocabs;
};

export const generateStructureList = async (): Promise<StructureItem[]> => {
  const ai = getAiClient();
  const model = "gemini-3-flash-preview";
  const prompt = `Generate 10 OPIc sentence structures (patterns). Focus on verbs and complex sentence starters.
  Format: { "structures": [ { "korean": "한글 패턴 (예: ~하는 것이 기억에 남아요)", "english": "English Structure (e.g., It remains memorable that I...)" } ] }`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          structures: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                korean: { type: Type.STRING },
                english: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  const data = JSON.parse(response.text || '{"structures":[]}');
  return data.structures;
};

export const generateKoreanSamples = async (question: string, masteredScripts: ScriptItem[]): Promise<{ samples: string[] }> => {
  const ai = getAiClient();
  const model = "gemini-3-flash-preview";
  const masteredContext = masteredScripts.length > 0 
    ? `The student is comfortable with these structures: ${masteredScripts.map(s => s.englishScript.slice(0, 50)).join(", ")}`
    : "";
  const prompt = `Question: "${question}"\nProvide 3 natural Korean sample answers. ${masteredContext}\nReturn JSON: { "samples": ["sample1", "sample2", "sample3"] }`;
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { samples: { type: Type.ARRAY, items: { type: Type.STRING } } }
      }
    }
  });
  return JSON.parse(response.text || '{"samples": []}');
};

export const generateEnglishScripts = async (koreanText: string): Promise<{ scripts: { label: string, text: string, logicFlow: string[] }[] }> => {
  const ai = getAiClient();
  const model = "gemini-3-flash-preview";
  const prompt = `Korean Answer: "${koreanText}"\nCreate 3 English versions (Simple, Natural, Detailed) with logicFlow.\nReturn JSON structure.`;
  // FIX: Per @google/genai guidelines, responseSchema should be an object literal. The `Schema` type is not part of the public API.
  const schema = {
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
    config: { responseMimeType: "application/json", responseSchema: schema }
  });
  return JSON.parse(response.text || '{"scripts": []}');
};

export const extractCommonPatterns = async (scripts: ScriptItem[]): Promise<{ patterns: { pattern: string, explanation: string, example: string }[] }> => {
  if (scripts.length === 0) return { patterns: [] };
  const ai = getAiClient();
  const model = "gemini-3-flash-preview";
  const scriptsText = scripts.map(s => s.englishScript).join("\n---\n");
  const prompt = `Analyze these OPIc scripts and extract 3 recurring useful sentence patterns. Return JSON: { "patterns": [ { "pattern": "...", "explanation": "...", "example": "..." } ] }`;
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