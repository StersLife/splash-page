// components/UpsellPropertiesSelector.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface Property {
  id: number;
  name: string;
}

interface UpsellPropertiesSelectorProps {
  properties: Property[];
  upsellId: string;
  // Array of property IDs that are already linked to the upsell.
  initialSelected?: number[];
}

export default function UpsellPropertiesSelector({
  properties,
  upsellId,
  initialSelected = [],
}: UpsellPropertiesSelectorProps) {
  // Local state for search input and selected property IDs.
  const [searchText, setSearchText] = useState('');
  // Initialize selection from the passed-in props.
  const [selected, setSelected] = useState<number[]>(initialSelected);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // When initialSelected prop changes, update the local state.
  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  // Filter properties based on the search text.
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) =>
      prop.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [properties, searchText]);

  // Toggle selection of an individual property.
  const toggleProperty = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Select all or deselect all properties in the filtered list.
  const selectAll = () => {
    const filteredIds = filteredProperties.map((p) => p.id);
    const isAllSelected = filteredIds.every((id) => selected.includes(id));
    if (isAllSelected) {
      setSelected(selected.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelected(Array.from(new Set([...selected, ...filteredIds])));
    }
  };

  // Save the updated selection via an API call.
  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/upsells/${upsellId}/upsell-properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyIds: selected,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error updating properties');
      } else {
        setSuccessMsg('Properties updated successfully!');
      }
    } catch (err) {
      setError('Something went wrong');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Select Properties</h2>
      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search properties..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Select All / Deselect All Button */}
      <div className="flex justify-between mb-4">
        <Button variant="outline" onClick={selectAll}>
          {filteredProperties.every((prop) => selected.includes(prop.id))
            ? 'Deselect All'
            : 'Select All'}
        </Button>
      </div>

      {/* List of Filtered Properties */}
      <div className="max-h-60 overflow-y-auto border p-2">
        {filteredProperties.map((property) => (
          <div key={property.id} className="flex items-center space-x-2 py-1">
            <input
              type="checkbox"
              checked={selected.includes(property.id)}
              onChange={() => toggleProperty(property.id)}
              className="accent-blue-500"
            />
            <span>{property.name}</span>
          </div>
        ))}
        {filteredProperties.length === 0 && (
          <p className="text-sm text-gray-500">No properties found.</p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {successMsg && <p className="text-green-500 text-sm mt-2">{successMsg}</p>}

      {/* Save Selections Button */}
      <div className="mt-4">
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Selections'}
        </Button>
      </div>
    </div>
  );
}
