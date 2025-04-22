'use client';

import { useState, useEffect } from 'react';
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
import { UpsellItem } from './upsell-items';

interface UpsellItemModalProps {
  mode: 'add' | 'edit';
  item?: UpsellItem;
  onItemChange?: (item: UpsellItem) => void;
  trigger?: React.ReactNode;
}

export default function UpsellItemModal({ 
  mode = 'add', 
  item, 
  onItemChange, 
  trigger 
}: UpsellItemModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const params = useParams<{ id: string }>();
  const router = useRouter();

  // Populate form fields when editing an existing item
  useEffect(() => {
    if (mode === 'edit' && item) {
      setName(item.name);
      setDescription(item.description || '');
      setPrice(item.price.toString());
    }
  }, [mode, item]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Different API call based on mode
      const url = mode === 'add' 
        ? `/api/upsells/${params.id}/upsell-items` 
        : `/api/upsells/${params.id}/upsell-items/${item?.id}`;
      
      const method = mode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || `Failed to ${mode === 'add' ? 'add' : 'update'} item`);
      } else {
        const updatedItem = await res.json();
        if (onItemChange) onItemChange(updatedItem);
        // Reset the form fields upon success and close the modal.
        resetForm();
        setOpen(false);
        router.refresh();
      }
    } catch (err) {
      setError('Something went wrong');
    }
    setIsSubmitting(false);
  };

  const dialogTitle = mode === 'add' ? 'Add New Item' : 'Edit Item';
  const dialogDescription = mode === 'add' 
    ? 'Fill out the form below to add a new upsell item.'
    : 'Update the details of your upsell item.';
  const submitButtonText = isSubmitting 
    ? (mode === 'add' ? 'Adding...' : 'Updating...') 
    : (mode === 'add' ? 'Add' : 'Update');

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={mode === 'add' ? "default" : "outline"}>
            {mode === 'add' ? 'Add New Item' : 'Edit'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}