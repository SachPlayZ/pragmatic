import { useState, useEffect } from 'react'

export function useRandomFact(facts: string[], interval: number = 10000) {
  const [currentFact, setCurrentFact] = useState<string>('')

  useEffect(() => {
    const getRandomFact = () => {
      const randomIndex = Math.floor(Math.random() * facts.length)
      setCurrentFact(facts[randomIndex])
    }

    getRandomFact() // Set initial fact
    const timer = setInterval(getRandomFact, interval)

    return () => clearInterval(timer)
  }, [facts, interval])

  return currentFact
}

