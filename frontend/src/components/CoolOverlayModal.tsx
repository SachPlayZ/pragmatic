"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropertyCard from './PropertyCard'
import ComparisonData from './ComparisonData'
import TableView from './TableView'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface Property {
  id: number
  owner: string
  name: string
  location: string
  price: string
  bedrooms: number
  sqft: number
  imageUrl: string
  ammenities: string
}

interface ComparisonItem {
  id: number
  Pros: string[]
  Cons: string[]
  "Unique Features": string[]
  "Professional Opinion": string
  "Overall Rating": number
}

interface ComparisonObject {
  "Best Property": number
  "Worst Property": number
  Comparison: ComparisonItem[]
}

interface CoolOverlayModalProps {
  isOpen: boolean
  onClose: () => void
  properties: Property[]
  comparisonObject: ComparisonObject
}

const CoolOverlayModal: React.FC<CoolOverlayModalProps> = ({ isOpen, onClose, properties, comparisonObject }) => {
  const [activeProperty, setActiveProperty] = useState<number>(properties[0].id)
  const [isTableView, setIsTableView] = useState(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-[#0A1A1F]/90 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 backdrop-blur-sm border border-white/10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Property Comparison</h2>
            <div className="flex items-center justify-center mb-4">
              <Label htmlFor="table-view" className="mr-2 text-sm font-medium text-white/80">
                Card View
              </Label>
              <Switch
                id="table-view"
                checked={isTableView}
                onCheckedChange={setIsTableView}
              />
              <Label htmlFor="table-view" className="ml-2 text-sm font-medium text-white/80">
                Table View
              </Label>
            </div>
            <AnimatePresence mode="wait">
              {isTableView ? (
                <motion.div
                  key="table-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableView properties={properties} comparisonObject={comparisonObject} />
                </motion.div>
              ) : (
                <motion.div
                  key="card-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isBest={property.id === comparisonObject["Best Property"]}
                        isWorst={property.id === comparisonObject["Worst Property"]}
                        isActive={property.id === activeProperty}
                        onClick={() => setActiveProperty(property.id)}
                      />
                    ))}
                  </div>
                  <ComparisonData
                    comparisonObject={comparisonObject}
                    activeProperty={activeProperty}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CoolOverlayModal

