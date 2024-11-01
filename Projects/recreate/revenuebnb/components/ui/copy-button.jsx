'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Check } from 'lucide-react';
import { useState } from 'react';

const CopyButton = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Example URL for testing - in real use, you'd use your actual URL
 
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setIsChecked(true);
        setShowFeedback(true);

        setTimeout(() => {
          setIsChecked(false);
          setShowFeedback(false);
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <Button 
        size="icon" 
        variant="ghost" 
        className="rounded-full hover:bg-secondary/80 transition-colors"
        onClick={handleCopy}
      >
        {!isChecked && (
          <Bookmark className="h-5 w-5" />
        )  }
      </Button>
      
      {showFeedback && (
        <div className="text-xs bg-secondary/90 px-2 py-1 rounded-md whitespace-nowrap animate-in fade-in slide-in-from-left-1 duration-200">
          Copied!
        </div>
      )}
    </div>
  );
};

export default CopyButton;