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
  addMessage: () => {},
  clearMessages: () => {},
})

export const useChat = () => useContext(Ctx)

export function ChatProvider({ children }: { children: ReactNode }) {
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
