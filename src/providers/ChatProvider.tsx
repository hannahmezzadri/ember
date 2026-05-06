import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type ChatChannel = 'voice' | 'chat' | 'case';
export type ChatStatus = 'ai-handling' | 'awaiting-handoff' | 'agent-active' | 'wrap-up';
export type ChatMode = 'copilot' | 'autopilot';

export type ChatMessage = {
  id: string;
  author: 'customer' | 'agent' | 'ai' | 'system';
  text: string;
  timestamp: string;
};

export type Chat = {
  id: string;
  customerId: string;
  customerName: string;
  channel: ChatChannel;
  status: ChatStatus;
  mode: ChatMode;
  intent: string;
  startedAt: string;
  messages: ChatMessage[];
  unread: number;
};

const MAX_CHATS = 8;

const seedChats: Chat[] = [
  {
    id: 'c1',
    customerId: 'cust_002',
    customerName: 'Marcus Chen',
    channel: 'chat',
    status: 'agent-active',
    mode: 'copilot',
    intent: 'Dispute pending charge',
    startedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    messages: [
      {
        id: 'm1',
        author: 'customer',
        text: "Hi, I see a $89.40 charge from 'BLUEROCK' I don't recognize.",
        timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      },
      {
        id: 'm2',
        author: 'ai',
        text: 'Suggested: "I can help you dispute that. Was the card in your possession on the transaction date?"',
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
    ],
    unread: 1,
  },
  {
    id: 'c2',
    customerId: 'cust_005',
    customerName: 'Priya Patel',
    channel: 'chat',
    status: 'ai-handling',
    mode: 'autopilot',
    intent: 'Reset autopay',
    startedAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    messages: [],
    unread: 0,
  },
  {
    id: 'c3',
    customerId: 'cust_007',
    customerName: 'Esposito Hardware LLC',
    channel: 'case',
    status: 'awaiting-handoff',
    mode: 'copilot',
    intent: 'Add user · permission escalation',
    startedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    messages: [],
    unread: 2,
  },
];

type ChatContextValue = {
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  globalAutopilot: boolean;
  setGlobalAutopilot: (v: boolean) => void;
  setChatMode: (id: string, mode: ChatMode) => void;
  takeOver: (id: string) => void;
  closeChat: (id: string) => void;
  maxChats: number;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(seedChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(seedChats[0]?.id ?? null);
  const [globalAutopilot, setGlobalAutopilotState] = useState(false);

  const setGlobalAutopilot = useCallback((v: boolean) => {
    setGlobalAutopilotState(v);
    if (v) {
      setChats((cs) => cs.map((c) => ({ ...c, mode: 'autopilot', status: c.status === 'agent-active' ? 'ai-handling' : c.status })));
    }
  }, []);

  const setChatMode = useCallback((id: string, mode: ChatMode) => {
    setChats((cs) => cs.map((c) => (c.id === id ? { ...c, mode } : c)));
  }, []);

  const takeOver = useCallback((id: string) => {
    setChats((cs) =>
      cs.map((c) =>
        c.id === id ? { ...c, status: 'agent-active', mode: 'copilot', unread: 0 } : c
      )
    );
    setActiveChatId(id);
  }, []);

  const closeChat = useCallback((id: string) => {
    setChats((cs) => cs.filter((c) => c.id !== id));
    setActiveChatId((curr) => (curr === id ? null : curr));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        setActiveChatId,
        globalAutopilot,
        setGlobalAutopilot,
        setChatMode,
        takeOver,
        closeChat,
        maxChats: MAX_CHATS,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChats must be used within ChatProvider');
  return ctx;
}
