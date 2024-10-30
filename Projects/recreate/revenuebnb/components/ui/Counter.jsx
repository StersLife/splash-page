'use client'
import { Minus, Plus } from 'lucide-react';
import React, { useState } from 'react';

const Counter = ({ text, value, onChange, min = 0, max = 10 }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={value <= min}
    >
      <Minus size={20} />
    </button>
    <span className="w-8 text-center text-gray-700">{value}</span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={value >= max}
    >
      <Plus size={20} />
    </button>
  </div>
);


export default Counter;