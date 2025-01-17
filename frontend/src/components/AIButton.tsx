import { Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AIButtonProps {
  onClick: () => void
}

export function AIButton({ onClick }: AIButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg transition-transform hover:scale-110 bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F]"
    >
      <Bot className="h-6 w-6" />
    </Button>
  )
}

