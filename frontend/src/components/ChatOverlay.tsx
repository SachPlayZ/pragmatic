import { useState, useRef, useEffect } from 'react'
import { X, User, Bot, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useRandomFact } from '../hooks/useRandomFact'

interface ChatOverlayProps {
  isOpen: boolean
  onClose: () => void
  aiName: string
  facts: string[]
}

export function ChatOverlay({ isOpen, onClose, aiName, facts }: ChatOverlayProps) {
  const [messages, setMessages] = useState<{ content: string; role: 'user' | 'ai' }[]>([])
  const [input, setInput] = useState('')
  const currentFact = useRandomFact(facts)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      const fetchResponse = async () => {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/getAnswer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: input, context: messages }),
        })
        const data = await response.json()
        return data.answer
      }
      setMessages([...messages, { content: input, role: 'user' }])
      setInput('')
      setTimeout(async () => {
        const answer = await fetchResponse()
        setMessages(prev => [...prev, { content: answer, role: 'ai' }])
      }, 1000)
    }
  }

  const handleRefresh = () => {
    setMessages([])
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-[#0A1A1F] border border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">{aiName}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="text-white hover:text-[#D0FD3E]"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:text-[#D0FD3E]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-[400px] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex max-w-[80%] items-start space-x-2 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    message.role === 'user' ? 'bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A]' : 'bg-white/10'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-5 w-5 text-[#0A1A1F]" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F]'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-2">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-white/5 text-white placeholder-white/50 border-white/10"
            />
            <Button type="submit" className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F] hover:shadow-lg hover:shadow-[#D0FD3E]/20 transition-all">
              Send
            </Button>
          </form>
          <div className="text-center text-sm text-white/60">{currentFact}</div>
        </CardFooter>
      </Card>
    </div>
  )
}

