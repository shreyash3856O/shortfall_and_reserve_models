import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import groqService from '../../services/groqService';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  engine?: 'GROQ' | 'MIDAS_LOCAL';
  sources?: string[];
  suggested?: string[];
  timestamp: Date;
}

export default function ChatbotDrawer({ isOpen, onClose }: ChatbotDrawerProps) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(groqService.getApiKey());
  const [activeEngine, setActiveEngine] = useState<'GROQ' | 'MIDAS_LOCAL'>(
    groqService.getApiKey() ? 'GROQ' : 'MIDAS_LOCAL'
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    'Why is Mine MN01 at risk this month?',
    'What is our total estimated tonnage in the high-grade zone?',
    'Show model validation accuracy and recall metrics',
    'Which spare parts should we requisition immediately for Balaghat?',
  ];

  useEffect(() => {
    const welcome: MessageItem = {
      id: 'welcome',
      sender: 'assistant',
      text: 'MIDAS AI Assistant active. I provide real-time mine shortfall risk assessments, SHAP root-cause attributions, prescriptive rules, equipment dispatch forecasts, and geological reserve block estimates.',
      suggested: suggestedQueries,
      timestamp: new Date(),
    };
    setMessages([welcome]);
  }, [i18n.language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (userText?: string) => {
    const query = userText || inputValue.trim();
    if (!query || isLoading) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await groqService.sendMessage(query, i18n.language);
      setActiveEngine(result.engine);

      const assistantMsg: MessageItem = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: result.reply,
        engine: result.engine,
        sources: result.sources,
        suggested: [
          'What are the recommended actions for Dongri Buzurg?',
          'Check fleet downtime across all 10 mines',
          'Show high-grade reserve breakdown',
        ],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to reach the MIDAS reasoning engine. Falling back to local telemetry cache.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = () => {
    groqService.setApiKey(apiKeyInput);
    setActiveEngine(apiKeyInput.trim() ? 'GROQ' : 'MIDAS_LOCAL');
    setShowKeyModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md md:max-w-lg bg-[#121216]/95 backdrop-blur-2xl border-l border-white/[0.08] z-50 flex flex-col shadow-2xl animate-fade-in font-sans">
      {/* Header */}
      <div className="h-14 border-b border-white/[0.06] px-5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F9067] animate-pulse"></span>
          <span className="text-[14px] font-extrabold text-[#F5F5F7] tracking-tight">
            {t('chat.title')}
          </span>
          <span
            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
              activeEngine === 'GROQ'
                ? 'bg-[#4F9067]/20 text-[#4F9067] border-[#4F9067]/30'
                : 'bg-white/[0.06] text-[#A0A0A8] border-white/[0.08]'
            }`}
          >
            {activeEngine === 'GROQ' ? 'Groq LLaMA 3.3 70B' : 'MIDAS Analytical Core'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Configure API Key Button */}
          <button
            onClick={() => setShowKeyModal(true)}
            title="Configure Groq API Key"
            className="text-[#888888] hover:text-white p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all text-xs flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-white text-[12px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Engine Status Banner */}
      <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.05] text-[11px] text-[#888888] flex items-center justify-between">
        <div>
          Grounded in <strong className="text-[#CCCCCC]">Live SCADA Telemetry &bull; XGBoost &bull; Ordinary Kriging</strong>
        </div>
        <button
          onClick={() => {
            groqService.clearHistory();
            setMessages([]);
          }}
          className="text-[#666666] hover:text-[#AAAAAA] underline text-[10px]"
        >
          Clear History
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[13px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
          >
            <div className="text-[10px] uppercase font-bold text-[#666666] mb-1 tracking-wider flex items-center gap-1.5">
              <span>{m.sender === 'user' ? '👤 Manager' : '🤖 MIDAS AI Core'}</span>
              <span className="text-[#444444] font-normal">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div
              className={`p-4 max-w-[92%] rounded-2xl border text-[13px] leading-relaxed shadow-sm ${
                m.sender === 'user'
                  ? 'bg-white/[0.08] border-white/[0.12] text-white rounded-br-sm'
                  : 'bg-[#18181F]/90 border-white/[0.06] text-[#E0E0E6] border-l-2 border-l-[#4F9067] rounded-bl-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] text-[#777777] flex flex-wrap items-center gap-1.5">
                  <span className="text-[#555555] font-semibold">Sources:</span>
                  {m.sources.map((src, i) => (
                    <span key={i} className="bg-white/[0.04] px-1.5 py-0.5 rounded text-[#999999]">
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Follow-up Queries */}
            {m.suggested && m.suggested.length > 0 && (
              <div className="mt-2.5 space-y-1.5 w-full max-w-[92%]">
                <div className="text-[10px] text-[#555555] font-bold uppercase tracking-wider">
                  Suggested Queries:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {m.suggested.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="text-left text-[11px] text-[#C0BDB8] bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-[#4F9067]/40 px-3 py-1.5 rounded-xl transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-[12px] text-[#888888] p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl max-w-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-[#4F9067] animate-ping"></span>
            <span>Reasoning across mine telemetry &amp; models...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-white/[0.06] bg-white/[0.02]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('chat.placeholder')}
            disabled={isLoading}
            className="flex-1 bg-[#101014] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-[#EFEFEF] focus:outline-none focus:border-[#4F9067]/70 transition-colors placeholder-[#555555]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-[#4F9067] hover:bg-[#3D7852] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-[12px] font-bold tracking-wide transition-all shadow-md hover:scale-[1.02]"
          >
            Send
          </button>
        </form>
      </div>

      {/* Groq API Key Settings Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#16161C] border border-white/[0.12] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-pop-up">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h3 className="text-[15px] font-bold text-[#F5F5F7]">Groq AI API Configuration</h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-[#888888] hover:text-white px-2 py-1 rounded-md text-xs"
              >
                &times;
              </button>
            </div>

            <p className="text-[12px] text-[#888888] leading-relaxed">
              Enter your Groq API key from <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-[#4F9067] underline">console.groq.com</a> to enable ultra-fast LLaMA 3.3 70B mining intelligence. If left blank, MIDAS will use its local analytical engine.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#AAAAAA]">Groq API Key (gsk_...):</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-[#101014] border border-white/[0.1] rounded-xl px-3.5 py-2 text-[12px] text-white focus:outline-none focus:border-[#4F9067]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={saveApiKey}
                className="flex-1 bg-[#4F9067] hover:bg-[#3D7852] text-white py-2.5 rounded-xl text-[12px] font-bold transition-all"
              >
                Save &amp; Activate
              </button>
              <button
                onClick={() => {
                  setApiKeyInput('');
                  groqService.setApiKey('');
                  setActiveEngine('MIDAS_LOCAL');
                  setShowKeyModal(false);
                }}
                className="px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-[#888888] hover:text-white rounded-xl text-[12px] transition-all"
              >
                Reset to Local
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
