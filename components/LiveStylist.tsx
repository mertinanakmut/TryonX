
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Language, translations } from '../translations';

interface LiveStylistProps {
  resultImage: string | null;
  lang: Language;
}

const LiveStylist: React.FC<LiveStylistProps> = ({ resultImage, lang }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  const t = translations[lang].live;

  // Manual base64 decoding as per instructions
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Manual raw PCM audio decoding as per instructions
  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    if (!process.env.API_KEY) return;
    setIsConnecting(true);
    
    try {
      // Create a new GoogleGenAI instance right before making an API call.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const session = await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: lang === 'tr' 
            ? "Dünya çapında bir moda stilistisiniz. Kullanıcı az önce yapay zeka kullanarak bir kıyafet denedi. Yardımcı, trendlere hakim olun ve spesifik stil önerileri verin. Yanıtları kısa ama şık tutun. Türkçe konuşun."
            : "You are a world-class fashion stylist. The user just tried on a garment using AI. Be helpful, trendy, and give specific styling advice. Keep responses concise but chic. Speak in English."
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Process model output audio bytes
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                ctx,
                24000,
                1
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle interruption
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                try { source.stop(); } catch (e) {}
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          },
          onerror: (e) => {
            console.error("Live Stylist Error", e);
            setIsConnecting(false);
            setIsActive(false);
          }
        }
      });
      sessionRef.current = session;
    } catch (e) {
      console.error(e);
      setIsConnecting(false);
    }
  };

  const endSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
    // Stop any remaining playing audio
    for (const source of sourcesRef.current.values()) {
      try { source.stop(); } catch (e) {}
    }
    sourcesRef.current.clear();
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isActive ? (
        <div className="bg-white rounded-2xl shadow-2xl p-4 border border-indigo-100 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">{t.listening}</p>
            <button onClick={endSession} className="text-[10px] text-red-500 font-bold uppercase hover:underline">{t.end}</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={startSession}
          disabled={isConnecting || !resultImage}
          className={`flex items-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${!resultImage && 'grayscale cursor-not-allowed'}`}
        >
          {isConnecting ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          )}
          <span className="font-bold text-sm">{isConnecting ? t.connecting : t.talk}</span>
        </button>
      )}
    </div>
  );
};

export default LiveStylist;
