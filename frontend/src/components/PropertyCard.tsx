import React from 'react'
import { motion } from 'framer-motion'

interface PropertyCardProps {
  property: {
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
  isBest: boolean
  isWorst: boolean
  isActive: boolean
  onClick: () => void
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isBest, isWorst, isActive, onClick }) => {
  const glowColor = isBest ? '#D0FD3E' : isWorst ? '#FF4136' : 'transparent'

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg cursor-pointer ${
        isActive ? 'ring-2 ring-[#D0FD3E]' : ''
      }`}
      style={{
        boxShadow: `0 0 20px ${glowColor}`,
      }}
    >
      <img src={property.imageUrl || "/placeholder.svg"} alt={property.name} className="w-full h-48 object-cover" />
      <div className="p-4 bg-[#0A1A1F]/90 backdrop-blur-sm border border-white/10">
        <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{property.name}</h3>
        <p className="text-white/80 mb-2">{property.location}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">${property.price}M</span>
          <span className="text-white/80">{property.bedrooms} beds | {property.sqft} sqft</span>
        </div>
        <p className="text-sm text-white/60">{property.ammenities}</p>
      </div>
      {isBest && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F] px-2 py-1 rounded-full text-xs font-semibold">
          Best Choice
        </div>
      )}
      {isWorst && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
          Needs Improvement
        </div>
      )}
    </motion.div>
  )
}

export default PropertyCard

