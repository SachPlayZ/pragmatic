import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ComparisonItem {
  id: number
  Pros: string[]
  Cons: string[]
  "Unique Features": string[]
  "Professional Opinion": string
  "Overall Rating": number
}

interface ComparisonDataProps {
  comparisonObject: {
    "Best Property": number
    "Worst Property": number
    Comparison: ComparisonItem[]
  }
  activeProperty: number
}

const ComparisonData: React.FC<ComparisonDataProps> = ({ comparisonObject, activeProperty }) => {
  // console.log
  const activeComparison = comparisonObject.Comparison.find(item => item.id === activeProperty)

  if (!activeComparison) return null

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Comparison Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`pros-${activeProperty}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#D0FD3E]/10 p-4 rounded-lg border border-[#D0FD3E]/30"
          >
            <h4 className="text-lg font-semibold mb-2 bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">Pros</h4>
            <ul className="list-disc list-inside">
              {activeComparison.Pros.map((pro, index) => (
                <li key={index} className="text-white/80">{pro}</li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={`cons-${activeProperty}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-red-500/10 p-4 rounded-lg border border-red-500/30"
          >
            <h4 className="text-lg font-semibold mb-2 bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">Cons</h4>
            <ul className="list-disc list-inside">
              {activeComparison.Cons.map((con, index) => (
                <li key={index} className="text-white/80">{con}</li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`unique-${activeProperty}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-6 bg-blue-500/10 p-4 rounded-lg border border-blue-500/30"
        >
          <h4 className="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Unique Features</h4>
          <ul className="list-disc list-inside">
            {activeComparison["Unique Features"].map((feature, index) => (
              <li key={index} className="text-white/80">{feature}</li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          key={`opinion-${activeProperty}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-6 bg-purple-500/10 p-4 rounded-lg border border-purple-500/30"
        >
          <h4 className="text-lg font-semibold mb-2 bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">Professional Opinion</h4>
          <p className="text-white/80">{activeComparison["Professional Opinion"]}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-center">
        <div className="bg-[#D0FD3E]/10 px-4 py-2 rounded-full border border-[#D0FD3E]/30">
          <span className="text-lg font-semibold text-white/80">Overall Rating: </span>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">{activeComparison["Overall Rating"]}/5</span>
        </div>
      </div>
    </div>
  )
}

export default ComparisonData

