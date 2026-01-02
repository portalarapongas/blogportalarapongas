
import { GoogleGenAI, Type } from "@google/genai";
import { GroundingChunk, WeatherData, NewsArticle } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

async function callWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorMessage = error?.message || "";
    if (retries > 0 && (errorMessage.includes("429") || error?.status === 429)) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const fetchArapongasNews = async (): Promise<{ text: string, links: GroundingChunk[] }> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Quais as notícias mais importantes de Arapongas agora? Forneça um resumo editorial profissional para a abertura da rádio. Aja como a Redação Central do Portal Arapongas.",
      config: { tools: [{ googleSearch: {} }] },
    });
    return { 
      text: response.text || "Boletim informativo em atualização.", 
      links: (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[] 
    };
  }).catch(() => ({ text: "Sintonizando informações da redação...", links: [] }));
};

export const fetchNewsList = async (count: number = 8): Promise<NewsArticle[]> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Gere uma lista das ${count} notícias mais recentes de Arapongas, PR. Para cada notícia, crie um 'title', um 'summary' curto para o card e um 'fullContent' (3 a 4 parágrafos detalhados) para que o usuário possa ler tudo dentro do nosso app. Retorne apenas JSON puro.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              fullContent: { type: Type.STRING },
              url: { type: Type.STRING },
              date: { type: Type.STRING }
            },
            required: ["title", "summary", "fullContent", "url", "date"]
          }
        }
      },
    });
    try {
      return JSON.parse(response.text || "[]");
    } catch { return []; }
  }).catch(() => []);
};

export const fetchArapongasWeather = async (): Promise<WeatherData> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Tempo em Arapongas, PR agora? Resumo curto e elegante para rádio.",
      config: { tools: [{ googleSearch: {} }] },
    });
    return { 
      text: response.text || "Clima estável.", 
      links: (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[] 
    };
  }).catch(() => ({ text: "Atualizando dados climáticos...", links: [] }));
};

export const askArapongasAssistant = async (question: string): Promise<{ text: string, links: GroundingChunk[] }> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Responda como a Central de Atendimento do Portal Arapongas: ${question}`,
      config: { tools: [{ googleSearch: {} }] },
    });
    return { 
      text: response.text || "Não conseguimos processar sua dúvida no momento.", 
      links: (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[] 
    };
  }).catch(() => ({ text: "Redação temporariamente ocupada.", links: [] }));
};
