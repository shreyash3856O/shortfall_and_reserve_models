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
  model?: string;
  sources?: string[];
  suggested?: string[];
  timestamp: Date;
}

// ─────────────────────────────────────────────────────────────────────
// Markdown renderer: converts AI markdown responses into styled HTML
// ─────────────────────────────────────────────────────────────────────
function renderMarkdown(raw: string): React.ReactNode {
  const lines = raw.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  const renderInline = (text: string, key?: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let last = 0;
    const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
    let m: RegExpExecArray | null;
    let partKey = 0;
    while ((m = pattern.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      if (m[0].startsWith('**')) {
        parts.push(<strong key={`b-${key}-${partKey++}`} className="font-bold text-white">{m[2]}</strong>);
      } else if (m[0].startsWith('*')) {
        parts.push(<em key={`i-${key}-${partKey++}`} className="italic text-[#D0D0D8]">{m[3]}</em>);
      } else if (m[0].startsWith('`')) {
        parts.push(
          <code key={`c-${key}-${partKey++}`} className="bg-white/10 text-[#B0F0C8] text-[11px] px-1.5 py-0.5 rounded font-mono">
            {m[4]}
          </code>
        );
      }
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      nodes.push(<div key={`br-${i}`} className="h-1" />);
      i++;
      continue;
    }

    if (/^# (.+)/.test(line)) {
      nodes.push(
        <h1 key={`h1-${i}`} className="text-[15px] font-extrabold text-white mt-2 mb-1">
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    if (/^## (.+)/.test(line)) {
      nodes.push(
        <h2 key={`h2-${i}`} className="text-[13px] font-bold text-[#D0D0D8] mt-2 mb-0.5">
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    if (/^### (.+)/.test(line)) {
      nodes.push(
        <h3 key={`h3-${i}`} className="text-[12px] font-semibold text-[#AAAAAA] mt-1.5 mb-0.5">
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    if (/^\d+[.)]\s/.test(line)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && /^\d+[.)]\s/.test(lines[i])) {
        const itemText = lines[i].replace(/^\d+[.)]\s/, '');
        listItems.push(
          <li key={`ol-item-${i}`} className="flex gap-2 items-start mb-0.5">
            <span className="text-[#4F9067] font-bold text-[11px] mt-0.5 flex-shrink-0 w-4 text-right">
              {(listItems.length + 1) + '.'}
            </span>
            <span className="flex-1 text-[13px] leading-relaxed">{renderInline(itemText, `ol${i}`)}</span>
          </li>
        );
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="space-y-0.5 mt-1 mb-1.5">
          {listItems}
        </ol>
      );
      continue;
    }

    if (/^[\*\-•]\s/.test(line.trim())) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && /^[\*\-•]\s/.test(lines[i].trim())) {
        const isIndented = lines[i].startsWith('    ') || lines[i].startsWith('\t');
        const itemText = lines[i].trim().replace(/^[\*\-•]\s/, '');
        listItems.push(
          <li key={`ul-item-${i}`} className={`flex gap-2 items-start mb-0.5 ${isIndented ? 'ml-4' : ''}`}>
            <span className={`flex-shrink-0 mt-1.5 ${isIndented ? 'text-[#666666]' : 'text-[#4F9067]'}`}>
              <svg className="w-1.5 h-1.5" viewBox="0 0 6 6" fill="currentColor">
                <circle cx="3" cy="3" r="3" />
              </svg>
            </span>
            <span className="flex-1 text-[13px] leading-relaxed">{renderInline(itemText, `ul${i}`)}</span>
          </li>
        );
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="space-y-0.5 mt-1 mb-1.5">
          {listItems}
        </ul>
      );
      continue;
    }

    if (/^---+$|^\*\*\*+$/.test(line.trim())) {
      nodes.push(<hr key={`hr-${i}`} className="border-white/[0.08] my-2" />);
      i++;
      continue;
    }

    nodes.push(
      <p key={`p-${i}`} className="text-[13px] leading-relaxed text-[#E0E0E6] mb-1">
        {renderInline(line, `p${i}`)}
      </p>
    );
    i++;
  }

  return <>{nodes}</>;
}

// ─────────────────────────────────────────────────────────────────────

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
  const [activeModel, setActiveModel] = useState(groqService.getModel());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getSuggestedQueries = () => [
    t('chat.query1'),
    t('chat.query2'),
    t('chat.query3'),
    t('chat.query4'),
  ];

  useEffect(() => {
    const welcome: MessageItem = {
      id: 'welcome',
      sender: 'assistant',
      text: t('chat.welcomeMessage'),
      suggested: getSuggestedQueries(),
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
      if (result.model) setActiveModel(result.model);

      const assistantMsg: MessageItem = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: result.reply,
        engine: result.engine,
        model: result.model,
        sources: result.sources,
        suggested: [
          t('chat.query1'),
          t('chat.query2'),
          t('chat.query3'),
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
          text: '⚠️ Unable to reach the MIDAS reasoning engine. Falling back to local telemetry cache.',
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

  const modelLabel = activeModel.replace('qwen/', 'Qwen ').replace('groq/', 'Groq ').replace('openai/', 'GPT ');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md md:max-w-lg bg-[#121216]/97 backdrop-blur-2xl border-l border-white/[0.08] z-50 flex flex-col shadow-2xl animate-fade-in font-sans">
      {/* Header */}
      <div className="h-14 border-b border-white/[0.06] px-5 flex items-center justify-between bg-white/[0.02] flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F9067] animate-pulse flex-shrink-0"></span>
          <span className="text-[14px] font-extrabold text-[#F5F5F7] tracking-tight truncate">
            {t('chat.title')}
          </span>
          <span
            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border flex-shrink-0 ${
              activeEngine === 'GROQ'
                ? 'bg-[#4F9067]/20 text-[#4F9067] border-[#4F9067]/30'
                : 'bg-white/[0.06] text-[#A0A0A8] border-white/[0.08]'
            }`}
          >
            {activeEngine === 'GROQ' ? `Groq ${modelLabel}` : 'MIDAS Analytical Core'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowKeyModal(true)}
            title="Configure Groq API Key"
            className="text-[#888888] hover:text-white p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all text-xs flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-5 py-2 bg-white/[0.01] border-b border-white/[0.04] text-[10px] text-[#666666] flex items-center justify-between flex-shrink-0">
        <div>
          Grounded in <strong className="text-[#999999]">Live SCADA Telemetry · XGBoost · Ordinary Kriging</strong>
        </div>
        <button
          onClick={() => {
            groqService.clearHistory();
            setMessages([]);
          }}
          className="text-[#555555] hover:text-[#AAAAAA] underline text-[10px]"
        >
          Clear History
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
          >
            {/* Sender label */}
            <div className="text-[10px] uppercase font-bold text-[#555555] mb-1.5 flex items-center gap-2">
              <span>{m.sender === 'user' ? '👤 Manager' : '🤖 MIDAS AI Core'}</span>
              <span className="text-[#3A3A3F] font-normal">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[92%] rounded-2xl border px-4 py-3 shadow-sm ${
                m.sender === 'user'
                  ? 'bg-white/[0.07] border-white/[0.10] text-white rounded-br-sm'
                  : 'bg-[#16161E] border-white/[0.06] border-l-2 border-l-[#4F9067] rounded-bl-sm'
              }`}
            >
              {m.sender === 'assistant' ? (
                <div className="prose-sm">
                  {renderMarkdown(m.text)}
                </div>
              ) : (
                <p className="text-[13px] leading-relaxed">{m.text}</p>
              )}

              {/* Sources */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] font-bold text-[#444444] uppercase tracking-wider">Sources:</span>
                  {m.sources.map((src, idx) => (
                    <span key={idx} className="text-[10px] bg-white/[0.03] px-1.5 py-0.5 rounded text-[#888888] border border-white/[0.04]">
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Follow-up Queries */}
            {m.suggested && m.suggested.length > 0 && (
              <div className="mt-2.5 w-full max-w-[92%]">
                <div className="text-[9px] text-[#444444] font-bold uppercase tracking-wider mb-1.5">
                  {t('chat.quickQueries')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {m.suggested.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="text-left text-[11px] text-[#B0B0BC] bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] hover:border-[#4F9067]/40 hover:text-white px-3 py-1.5 rounded-xl transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#16161E] border border-white/[0.06] border-l-2 border-l-[#4F9067] rounded-2xl rounded-bl-sm max-w-[60%] animate-fade-in">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#4F9067]"
                  style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
            <span className="text-[11px] text-[#777777]">Reasoning across mine telemetry…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-white/[0.06] bg-white/[0.01] flex-shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('chat.placeholder')}
            disabled={isLoading}
            className="flex-1 bg-[#101014] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-[#EFEFEF] focus:outline-none focus:border-[#4F9067]/60 transition-colors placeholder-[#444444]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-[#4F9067] hover:bg-[#3D7852] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-[12px] font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-95"
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
              <h3 className="text-[15px] font-bold text-[#F5F5F7]">Groq AI Configuration</h3>
              <button onClick={() => setShowKeyModal(false)} className="text-[#888888] hover:text-white px-2 py-1 rounded-md">✕</button>
            </div>

            <p className="text-[12px] text-[#888888] leading-relaxed">
              Enter your Groq API key from{' '}
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-[#4F9067] underline">
                console.groq.com
              </a>{' '}
              to enable ultra-fast AI mining intelligence. If blank, MIDAS will use its local analytical engine.
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

            <div className="flex gap-2 pt-1">
              <button
                onClick={saveApiKey}
                className="flex-1 bg-[#4F9067] hover:bg-[#3D7852] text-white py-2.5 rounded-xl text-[12px] font-bold transition-all"
              >
                Save & Activate
              </button>
              <button
                onClick={() => { setApiKeyInput(''); groqService.setApiKey(''); setActiveEngine('MIDAS_LOCAL'); setShowKeyModal(false); }}
                className="px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-[#888888] hover:text-white rounded-xl text-[12px] transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
