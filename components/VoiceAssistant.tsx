
import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

interface VoiceAssistantProps {
  onClose: () => void;
}

// Manual encoding/decoding as per guidelines
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'responding' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setStatus('connecting');
    setErrorMsg(null);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      // Direct user gesture triggered this component mount, but we add an explicit catch
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => {
        console.error("Microphone access error:", err);
        throw new Error("Microphone permission was denied, dismissed, or blocked. Please allow access in your browser settings to speak with the mentor.");
      });

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const base64 = encodeBase64(new Uint8Array(int16.buffer));
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: any) => {
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
                setStatus('responding');
                const base64 = message.serverContent.modelTurn.parts[0].inlineData.data;
                const bytes = decodeBase64(base64);
                
                const dataInt16 = new Int16Array(bytes.buffer);
                const buffer = outputContext.createBuffer(1, dataInt16.length, 24000);
                const channelData = buffer.getChannelData(0);
                for (let i = 0; i < dataInt16.length; i++) {
                  channelData[i] = dataInt16[i] / 32768.0;
                }

                const source = outputContext.createBufferSource();
                source.buffer = buffer;
                source.connect(outputContext.destination);
                
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContext.currentTime);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);

                source.onended = () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) {
                    setStatus('listening');
                  }
                };
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current) {
                try { source.stop(); } catch(e) {}
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('listening');
            }
          },
          onerror: (e) => {
            console.error('Gemini Live Error:', e);
            setStatus('error');
            setErrorMsg("A connection error occurred with the AI mentor. Please try again.");
          },
          onclose: () => setStatus('idle')
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: "You are a warm, professional career mentor for students. Provide concise, encouraging, and spoken-friendly advice about careers, internships, and portfolio building."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || "Could not access microphone.");
    }
  };

  useEffect(() => {
    startSession();
    return () => {
      if (sessionRef.current) {
        try { sessionRef.current.close(); } catch(e) {}
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch(e) {}
      }
      for (const source of sourcesRef.current) {
        try { source.stop(); } catch(e) {}
      }
      sourcesRef.current.clear();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-md w-full text-center space-y-12">
        <div className="relative">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center relative transition-all duration-500 ${
            status === 'listening' ? 'bg-blue-600 scale-110 voice-pulse shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 
            status === 'responding' ? 'bg-indigo-600 scale-110 shadow-[0_0_50px_rgba(79,70,229,0.3)]' :
            status === 'error' ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-slate-700'
          }`}>
            {status === 'error' ? (
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            ) : (
              <svg className={`w-16 h-16 text-white transition-transform ${status === 'listening' ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            )}
          </div>
          <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 text-white text-[10px] font-bold uppercase rounded-full tracking-widest shadow-lg ${
            status === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}>
             {status}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">
            {status === 'error' ? 'Microphone Access Needed' : status === 'connecting' ? 'Connecting Mentor...' : 'Live AI Mentor'}
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            {errorMsg || "Ask about internship prep, resume tips, or networking strategies. I'm listening to your voice."}
          </p>
        </div>

        {status === 'error' && (
          <button 
            onClick={startSession}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
          >
            Grant Permission & Retry
          </button>
        )}

        <div className="h-24 flex items-center justify-center space-x-2">
           {[...Array(12)].map((_, i) => (
             <div 
              key={i} 
              className={`w-1.5 bg-blue-400 rounded-full transition-all duration-150 ${status === 'listening' || status === 'responding' ? 'opacity-100' : 'opacity-20'}`}
              style={{ 
                height: status === 'responding' ? `${Math.random() * 60 + 10}px` : status === 'listening' ? '8px' : '4px',
                animation: status === 'listening' ? `pulse 1.5s infinite ${i * 100}ms` : 'none',
                backgroundColor: status === 'responding' ? '#818cf8' : '#3b82f6'
              }}
             ></div>
           ))}
        </div>

        <button 
          onClick={onClose}
          className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/10"
        >
          {status === 'error' ? 'Dismiss' : 'End Session'}
        </button>
      </div>
    </div>
  );
};

export default VoiceAssistant;
