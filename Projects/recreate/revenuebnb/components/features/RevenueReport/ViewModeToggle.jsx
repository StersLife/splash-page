'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { List, Map } from 'lucide-react'

const ViewModeToggle = ({
  handleViewChange
}) => {
  const [view, setView] = useState('list')
  return (
    
      <div className="relative hide-toggle inline-flex bg-white rounded-full p-1 shadow-lg">
        <button
          onClick={() => {
            setView('list')
            handleViewChange('list')            }}
          className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out rounded-full focus:outline-none ${
            view === 'list' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
          }`}
          aria-pressed={view === 'list'}
        >
          <span className="flex items-center">
            <List className="w-4 h-4 mr-2" aria-hidden="true" />
            List View
          </span>
        </button>
        <button
          onClick={() =>{
            
             setView('map')
            handleViewChange('map')
             }}
          className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out rounded-full focus:outline-none ${
            view === 'map' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
          }`}
          aria-pressed={view === 'map'}
        >
          <span className="flex items-center">
            <Map className="w-4 h-4 mr-2" aria-hidden="true" />
            Map View
          </span>
        </button>
        <motion.div
          className="absolute inset-0 bg-teal-600 rounded-full z-0"
          initial={false}
          animate={{
            x: view === 'list' ? 0 : '100%',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            width: '50%',
          }}
        />
      </div>
    
  )
}

export default ViewModeToggle