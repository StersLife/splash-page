'use client';

import { useLocationAutocomplete } from '@/hooks/useLocationAutocomplete';
import { MapPin } from 'lucide-react';
import { useRef, useEffect } from 'react';

// Simple custom hook for handling outside clicks
const useOutsideClick = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [callback]);

  return ref;
};

export const LocationInput = ({
  onLocationSelect,
  initialValue = '',
}) => {
  const {
    value,
    suggestions,
    isLoading,
    isError,
    showSuggestions,
    handleInputChange,
    handleSelectSuggestion,
    setShowSuggestions,
  } = useLocationAutocomplete({
    apiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
    initialValue,
    onLocationChange: (newLocation) => {
      // Handle location changes if needed
    },
    onError: (hasError) => {
      // Handle errors if needed
    }
  });

  const containerRef = useOutsideClick(() => {
    setShowSuggestions(false);
  });

  const handleSuggestionClick = (suggestion) => {
    handleSelectSuggestion(suggestion);
    onLocationSelect?.({
      coordinates: suggestion.geometry.coordinates,
      address: suggestion.place_name,
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {/* Input Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MapPin 
            className={`${value ? 'text-gray-600' : 'text-gray-400'}`}
            size={20}
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className={`
             pl-10
            pr-4
            py-3
            rounded-xl
            border
            text-base
            font-medium
            transition-all
            duration-200
            outline-none
            font-gt-medium
            ${value ? 'bg-gray-50' : 'bg-white'}
            ${isError 
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
              : 'border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
            }
          `}
          placeholder="Enter your address"
          aria-label="Location search"
          autoComplete="off"
        />
      </div>

      {/* Error Message */}
      {isError && (
        <p className="mt-2 text-sm text-red-500 font-medium">
          Please select an address from the dropdown
        </p>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="
          absolute
          w-full
          mt-1
          bg-white
          rounded-md
          shadow-lg
          border
          border-gray-200
          max-h-[300px]
          overflow-y-auto
          z-50
        ">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="
                flex
                items-center
                gap-3
                p-3
                cursor-pointer
                hover:bg-gray-50
                transition-colors
                duration-150
              "
            >
              {/* <MapPin size={16} className="text-gray-400" /> */}
              <p className="text-sm text-gray-700 line-clamp-2">
                {suggestion.place_name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && showSuggestions && (
        <div className="
          absolute
          w-full
          mt-1
          bg-white
          rounded-md
          shadow-lg
          p-4
          text-center
          text-gray-500
          z-50
        ">
          Loading suggestions...
        </div>
      )}
    </div>
  );
};