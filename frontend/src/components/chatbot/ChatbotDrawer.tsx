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

  useEffect(() => {
    const welcome: MessageItem = {
      id: 'welcome',
      sender: 'assistant',
      text: 'MIDAS Assistant active. I provide real-time mine shortfall risk assessments, SHAP root-cause attributions, prescriptive rules, and geological reserve block estimates.',
      suggested: [
        'Why is Mine MN01 at risk this month?',
        'What is our total estimated tonnage in the high-grade zone?',
        'Show model validation accuracy',
      ],
    };
    setMessages([welcome]);
  }, [i18n.language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (userText?: string) => {
    const query = userText || inputValue.trim();
    if (!query || isLoading) return;

    const userMsg: MessageItem = { id: String(Date.now()), sender: 'user', text: query };
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
      setMessages((prev) => [...prev, {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: 'Unable to reach the MIDAS analytical backend. Verify the FastAPI service is online.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#1A1A1A] border-l border-[#2E2E2E] z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="h-14 border-b border-[#2E2E2E] px-6 flex items-center justify-between bg-[#1E1E1E]">
        <div className="flex items-center gap-2 text-[14px] text-[#EFEFEF] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#4F9067]"></span>
          <span>{t('chat.title')}</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#888888] hover:text-[#EFEFEF] text-[12px] font-medium px-2.5 py-1 rounded bg-[#242424] border border-[#333333] transition-colors"
        >
          Close
        </button>
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-2 bg-[#161616] border-b border-[#2E2E2E] text-[11px] text-[#777777] font-medium">
        {t('chat.disclaimer')}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 text-[13px]">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="text-[10px] uppercase font-semibold text-[#666666] mb-1 tracking-wider">
              {m.sender === 'user' ? 'You' : 'MIDAS AI Engine'}
            </div>
            <div className={`p-3.5 max-w-[90%] rounded-lg border ${
              m.sender === 'user'
                ? 'bg-[#272727] border-[#3A3A3A] text-[#EFEFEF]'
                : 'bg-[#1E1E1E] border-[#2E2E2E] text-[#CCCCCC] border-l-2 border-l-[#C0BDB8]'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[#2E2E2E] text-[11px] text-[#666666]">
                  <span className="text-[#555555] font-semibold">Sources: </span>
                  {m.sources.join(' \u2022 ')}
                </div>
              )}
            </div>
            {m.suggested && m.suggested.length > 0 && (
              <div className="mt-2 space-y-1.5 w-full max-w-[90%]">
                <div className="text-[10px] text-[#555555] font-semibold uppercase tracking-wider">Suggested:</div>
                <div className="flex flex-wrap gap-1.5">
                  {m.suggested.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="text-left text-[11px] text-[#C0BDB8] bg-[#1E1E1E] hover:bg-[#252525] border border-[#2E2E2E] hover:border-[#3A3A3A] px-2.5 py-1 rounded transition-colors"
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
          <div className="flex items-center gap-2 text-[12px] text-[#888888] p-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C0BDB8] animate-pulse"></span>
            <span>Querying ML models and telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#2E2E2E] bg-[#1E1E1E]">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="flex-1 bg-[#111111] border border-[#2E2E2E] rounded px-3.5 py-2 text-[13px] text-[#EFEFEF] focus:outline-none focus:border-[#4A4A4A] transition-colors placeholder-[#555555]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-[#2A2A2A] hover:bg-[#353535] disabled:opacity-40 border border-[#3C3C3C] text-[#EFEFEF] px-4 py-2 rounded text-[12px] font-bold tracking-wide transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
