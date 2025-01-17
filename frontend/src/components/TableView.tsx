import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

interface TableViewProps {
  properties: Property[]
  comparisonObject: ComparisonObject
}

const TableView: React.FC<TableViewProps> = ({ properties, comparisonObject }) => {
  const renderList = (items: string[]) => (
    <ul className="list-disc list-inside">
      {items.map((item, index) => (
        <li key={index} className="text-white/80">{item}</li>
      ))}
    </ul>
  )

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/10">
            <TableHead className="text-white">Property</TableHead>
            <TableHead className="text-white">Details</TableHead>
            <TableHead className="text-white">Pros</TableHead>
            <TableHead className="text-white">Cons</TableHead>
            <TableHead className="text-white">Unique Features</TableHead>
            <TableHead className="text-white">Professional Opinion</TableHead>
            <TableHead className="text-white">Overall Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => {
            const comparison = comparisonObject.Comparison.find(
              (item) => item.id === property.id
            )
            return (
              <TableRow key={property.id} className="border-b border-white/10">
                <TableCell className="font-medium">
                  <div className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{property.name}</div>
                  <div className="text-sm text-white/60">{property.location}</div>
                  {property.id === comparisonObject["Best Property"] && (
                    <span className="inline-block bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F] text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                      Best Choice
                    </span>
                  )}
                  {property.id === comparisonObject["Worst Property"] && (
                    <span className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                      Needs Improvement
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-white/80">Price: <span className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">${property.price}M</span></div>
                  <div className="text-white/80">Bedrooms: {property.bedrooms}</div>
                  <div className="text-white/80">Sqft: {property.sqft}</div>
                  <div className="text-white/80">Amenities: {property.ammenities}</div>
                </TableCell>
                <TableCell>{comparison && renderList(comparison.Pros)}</TableCell>
                <TableCell>{comparison && renderList(comparison.Cons)}</TableCell>
                <TableCell>{comparison && renderList(comparison["Unique Features"])}</TableCell>
                <TableCell className="text-white/80">{comparison && comparison["Professional Opinion"]}</TableCell>
                <TableCell>
                  {comparison && (
                    <span className="text-lg font-semibold bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">
                      {comparison["Overall Rating"]}/5
                    </span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default TableView

