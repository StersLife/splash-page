'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Building, LineChart, PieChart, Zap } from 'lucide-react'

const loadingSteps = [
  { icon: Building, text: 'Gathering property data...' },
  { icon: BarChart3, text: 'Analyzing market trends...' },
  { icon: LineChart, text: 'Projecting annual revenue...' },
  { icon: PieChart, text: 'Calculating ROI...' },
  { icon: Zap, text: 'Finalizing insights...' },
]

const LoadingStep = ({ step, isActive }) => {
  const CurrentStepIcon = loadingSteps[step].icon

  console.log({
    step,
    isActive,
    CurrentStepIcon
  })
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="flex items-center mb-4 text-teal-600"
    >
      <CurrentStepIcon className="w-6 h-6 mr-3 flex-shrink-0" />
      <span className="text-lg">{loadingSteps[step].text}</span>
      {isActive && (
        <motion.div
          className="ml-auto w-6 h-6 border-t-2 border-teal-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}

const LoadingSteps = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (isComplete) return

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval)
          setIsComplete(true)
          return prev
        }

        return prev + 1
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isComplete])
  console.log('hey')
  return (
    
    <div className="p-6 max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <LoadingStep
          key={currentStep}
          step={currentStep}
          isActive={!isComplete}
        />
      </AnimatePresence>
    </div>
  )
}

export default LoadingSteps