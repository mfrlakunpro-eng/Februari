
import { GoogleGenAI, Type } from "@google/genai";
import { AttendanceRecord } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAttendanceInsights = async (records: AttendanceRecord[]) => {
  if (!process.env.API_KEY) return "AI Insight tidak tersedia tanpa API Key.";

  try {
    const summary = records.map(r => `${r.studentName} (${r.className}) - ${r.type} pada ${r.timestamp}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analisis data absensi berikut dan berikan ringkasan singkat dalam 2-3 kalimat mengenai tren kehadiran hari ini:\n\n${summary}`,
      config: {
        systemInstruction: "Anda adalah asisten manajemen sekolah yang cerdas. Berikan analisis dalam Bahasa Indonesia yang profesional.",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal mendapatkan analisis AI saat ini.";
  }
};
