'use client';

import UpsellItemModal from './upsell-item-modal';

export interface UpsellItem {
  id: number;
  name: string;
  description?: string;
  price: number;
}

interface UpsellItemsProps {
  items: UpsellItem[];
  onItemChange?: (item: UpsellItem) => void;
}

export default function UpsellItems({ items, onItemChange }: UpsellItemsProps) {
  return (
    <div className="p-4">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">{item.name}</h2>
              {item.description && <p className="text-gray-700">{item.description}</p>}
              <p className="font-bold mt-2">${Number(item.price).toFixed(2)}</p>
            </div>
            <UpsellItemModal 
              mode="edit" 
              item={item} 
              onItemChange={onItemChange} 
              trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
            />
          </div>
        ))}
      </div>
      <div className="mt-6">
        <UpsellItemModal mode="add" onItemChange={onItemChange} />
      </div>
    </div>
  );
}