import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  type?: 'all' | 'images' | 'videos' | 'shopping' | 'news';
  // Specialized fields
  thumbnail?: string;
  price?: string;
  rating?: number;
  duration?: string;
  source?: string;
  date?: string;
}

export type SearchTab = 'all' | 'images' | 'videos' | 'shopping' | 'news';

export interface KnowledgeData {
  title: string;
  description: string;
  facts: { label: string; value: string }[];
  imagePrompt: string;
}

export const aiService = {
  async generateSearchResults(query: string, type: SearchTab = 'all'): Promise<SearchResult[]> {
    const typePrompt = {
      all: "Generate 10 diverse search results.",
      images: "Generate 12 image search results. The 'thumbnail' field MUST be 1-2 words describing the image subject (e.g. 'nebula', 'robot').",
      videos: "Generate 10 video results. Include 'duration', 'source', and 'thumbnail' (1-2 words).",
      shopping: "Generate 10 product results. Include 'price', 'rating', 'source', and 'thumbnail' (1-2 words).",
      news: "Generate 10 news results. Include 'source' and 'date'."
    }[type];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search Query: "${query}". Tab: "${type}". ${typePrompt} Return valid JSON array of objects with: title, url, snippet, thumbnail (optional), price (optional), rating (optional), duration (optional), source (optional), date (optional).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              url: { type: Type.STRING },
              snippet: { type: Type.STRING },
              thumbnail: { type: Type.STRING },
              price: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              duration: { type: Type.STRING },
              source: { type: Type.STRING },
              date: { type: Type.STRING },
            },
            required: ["title", "url", "snippet"],
          },
        },
      },
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse search results", e);
      return [];
    }
  },

  async generateKnowledgePanel(query: string): Promise<KnowledgeData | null> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a concise knowledge panel data for the search query: "${query}". 
      Include a title, a 2-3 sentence description, 3-4 key facts, and a short 5-word image prompt that describes a high-quality visual for this topic.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            facts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                },
                required: ["label", "value"],
              },
            },
            imagePrompt: { type: Type.STRING },
          },
          required: ["title", "description", "facts", "imagePrompt"],
        },
      },
    });

    try {
      return JSON.parse(response.text || "null");
    } catch (e) {
      console.error("Failed to parse knowledge panel", e);
      return null;
    }
  }
};
