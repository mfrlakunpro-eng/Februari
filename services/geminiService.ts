
import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord } from '../types';

// Initialize Gemini API client strictly following guidelines using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets attendance insights using Gemini AI.
 * Uses gemini-3-flash-preview for summarization task as per task type guidelines.
 */
export const getAttendanceInsights = async (records: AttendanceRecord[]) => {
  // Assume process.env.API_KEY is pre-configured and accessible per guidelines
  try {
    const summary = records.map(r => `${r.studentName} (${r.className}) - ${r.type} pada ${r.timestamp}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analisis data absensi berikut dan berikan ringkasan singkat dalam 2-3 kalimat mengenai tren kehadiran hari ini:\n\n${summary}`,
      config: {
        systemInstruction: "Anda adalah asisten manajemen sekolah yang cerdas. Berikan analisis dalam Bahasa Indonesia yang profesional.",
      }
    });

    // Directly access the .text property of the GenerateContentResponse object (not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal mendapatkan analisis AI saat ini.";
  }
};
