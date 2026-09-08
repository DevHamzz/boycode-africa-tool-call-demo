import { createContext, useContext, useState, ReactNode } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  error?: boolean
}

interface ChatCtx {
  messages: ChatMessage[]
  addMessage: (m: ChatMessage) => void
  clearMessages: () => void
}

const Ctx = createContext<ChatCtx>({
  messages: [],
  addMessage: () => { },
  clearMessages: () => { },
})

// Consumers use this hook instead of importing the context object directly.
export const useChat = () => useContext(Ctx)

export function ChatProvider({ children }: { children: ReactNode }) {
  // Keep chat messages available to pages that need to display or update them.
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const addMessage = (m: ChatMessage) =>
    setMessages((p) => [...p, m])

  const clearMessages = () => setMessages([])

  return (
    <Ctx.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </Ctx.Provider>
  )
}
