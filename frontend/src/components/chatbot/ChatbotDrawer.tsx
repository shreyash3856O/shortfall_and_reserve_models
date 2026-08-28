import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { api, ChatResponse } from '../../api/client';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  suggested?: string[];
}

export default function ChatbotDrawer({ isOpen, onClose }: ChatbotDrawerProps) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message based on language
  useEffect(() => {
    const welcomeEn: MessageItem = {
      id: 'welcome',
      sender: 'assistant',
      text: 'MIDAS Assistant active. I provide real-time mine shortfall risk assessments, SHAP root-cause attributions, prescriptive rules, and geological reserve block estimates.',
      suggested: [
        'Why is Mine MN01 at risk this month?',
        'What is our total estimated tonnage in the high-grade zone?',
        'Show model validation accuracy',
      ],
    };
    setMessages([welcomeEn]);
  }, [i18n.language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (userText?: string) => {
    const query = userText || inputValue.trim();
    if (!query || isLoading) return;

    const userMsg: MessageItem = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res: ChatResponse = await api.sendChatMessage(query, i18n.language);
      const assistantMsg: MessageItem = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: res.reply,
        sources: res.sources_used,
        suggested: res.suggested_queries,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: MessageItem = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: 'Unable to communicate with the MIDAS analytical backend. Please verify that the FastAPI service is online.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#12151B] border-l border-[#232834] z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="h-14 border-b border-[#232834] px-5 flex items-center justify-between bg-[#161A22]">
        <div className="flex items-center gap-2 font-mono text-[13px] text-[#C8A96E] font-bold">
          <span>[?]</span>
          <span>{t('chat.title')}</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#8B949E] hover:text-[#E6EDF3] font-mono text-[13px] px-2 py-1 bg-[#1D222A] border border-[#232834]"
        >
          [ESC / CLOSE]
        </button>
      </div>

      {/* Grounding Disclaimer */}
      <div className="px-5 py-2 bg-[#0E1015] border-b border-[#232834] text-[10px] font-mono text-[#8B949E]">
        {t('chat.disclaimer')}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-[12px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="text-[10px] text-[#586069] mb-1">
              {m.sender === 'user' ? 'USER QUERY' : 'MIDAS AI ENGINE'}
            </div>
            <div
              className={`p-3 max-w-[90%] border ${
                m.sender === 'user'
                  ? 'bg-[#1D222A] border-[#2E3544] text-[#E6EDF3]'
                  : 'bg-[#161A22] border-[#232834] text-[#E6EDF3] border-l-2 border-l-[#C8A96E]'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>

              {/* Data Grounding Sources */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[#232834] text-[10px] text-[#8B949E]">
                  <span className="text-[#586069]">GROUNDED IN: </span>
                  {m.sources.join(' | ')}
                </div>
              )}
            </div>

            {/* Suggested Follow-up Queries */}
            {m.suggested && m.suggested.length > 0 && (
              <div className="mt-2 space-y-1 w-full max-w-[90%]">
                <div className="text-[9px] text-[#586069] tracking-wider uppercase">
                  Suggested Queries:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {m.suggested.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="text-left text-[10px] text-[#C8A96E] bg-[#161A22] hover:bg-[#1D222A] border border-[#232834] px-2 py-1 transition-colors"
                    >
                      &gt; {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-[11px] text-[#8B949E] font-mono p-2">
            <span className="inline-block w-2 h-2 bg-[#C8A96E] animate-pulse"></span>
            <span>Querying ML serving models and telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#232834] bg-[#161A22]">
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
            className="flex-1 bg-[#0B0D10] border border-[#232834] px-3 py-2 text-[12px] font-mono text-[#E6EDF3] focus:outline-none focus:border-[#C8A96E]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-[#1D222A] hover:bg-[#232834] disabled:opacity-50 text-[#C8A96E] border border-[#2E3544] px-4 py-2 text-[12px] font-mono font-bold transition-colors"
          >
            EXECUTE
          </button>
        </form>
      </div>
    </div>
  );
}
