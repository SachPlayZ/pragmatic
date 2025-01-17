'use client'

import { useState } from 'react'
import { AIButton } from './AIButton'
import { ChatOverlay } from './ChatOverlay'

interface AIAssistantProps {
  aiName: string
  facts: string[]
}

export function AIAssistant({ aiName, facts }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <AIButton onClick={() => setIsOpen(true)} />
      <ChatOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} aiName={aiName} facts={facts} />
    </>
  )
}

