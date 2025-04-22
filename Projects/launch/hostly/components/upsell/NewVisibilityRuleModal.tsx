// components/NewVisibilityRuleModal.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';

interface NewVisibilityRuleModalProps {
  onNewRule?: (rule: any) => void;
}

export default function NewVisibilityRuleModal({ onNewRule }: NewVisibilityRuleModalProps) {
  // Controlled dialog open state
  const [open, setOpen] = useState(false);
  // Form fields
  const [ruleType, setRuleType] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/upsells/${params.id}/upsell-visibility-rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rule_type: ruleType,
          value: parseInt(value, 10),
          unit,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to add new rule');
      } else {
        const newRule = await res.json();
        if (onNewRule) onNewRule(newRule);
        // Reset form fields and close the modal.
        setRuleType('');
        setValue('');
        setUnit('');
        setOpen(false);
        router.refresh();
      }
    } catch (err) {
      setError('Something went wrong');
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Visibility Rule</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Visibility Rule</DialogTitle>
          <DialogDescription>
            Set up a new visibility rule for this upsell.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rule Type</label>
            <select
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select a rule type</option>
              <option value="Before Check-in">Before Check-in</option>
              <option value="After Check-in">After Check-in</option>
              <option value="Before Checkout">Before Checkout</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., 6"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select a unit</option>
              <option value="hours">Hours</option>
              <option value="days">Day</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
