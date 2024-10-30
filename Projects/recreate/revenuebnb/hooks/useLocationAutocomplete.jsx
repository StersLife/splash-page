'use client';

import { useState, useCallback, useEffect } from 'react';

export const useLocationAutocomplete = ({ 
  apiKey, 
  initialValue = '',
  onLocationChange,
  onError,
  country = 'US', 
  debounceMs = 300 
}) => {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [timer, setTimer] = useState(null);

  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const endpoint = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchTerm)}.json`);
    
    endpoint.searchParams.append('types', 'country,address,place');
    endpoint.searchParams.append('access_token', apiKey);
    endpoint.searchParams.append('autocomplete', 'true');
    endpoint.searchParams.append('country', country);

    try {
      setIsLoading(true);
      setIsError(false);

      const response = await fetch(endpoint.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setSuggestions(data.features || []);
      setShowSuggestions(Boolean(data.features?.length));
      
      onError?.(false);
    } catch (error) {
      console.error('Failed to fetch location suggestions:', error);
      setIsError(true);
      setSuggestions([]);
      
      onError?.(true, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = useCallback(
    async (event, onSuccess) => {
      const newValue = event.target.value;
      
      setValue(newValue);
      onLocationChange?.(newValue);

      if (timer) {
        clearTimeout(timer);
      }

      const newTimer = setTimeout(() => {
        fetchSuggestions(newValue)
          .then(() => onSuccess?.())
          .catch((error) => {
            console.error('Error in handleInputChange:', error);
            setIsError(true);
            onError?.(true, error);
          });
      }, debounceMs);

      setTimer(newTimer);
    },
    [timer, debounceMs, onLocationChange, onError]
  );

  const handleSelectSuggestion = useCallback((suggestion) => {
    setValue(suggestion.place_name);
    onLocationChange?.(suggestion.place_name);
    setShowSuggestions(false);
  }, [onLocationChange]);

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return {
    value,
    suggestions,
    isLoading,
    isError,
    showSuggestions,
    handleInputChange,
    handleSelectSuggestion,
    setSuggestions,
    setShowSuggestions,
  };
};