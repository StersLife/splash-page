'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, )

type UpsellItem = {
  id: string
  name: string
  description?: string
  price: number
}

type Props = {
  upsellId: string
  reservationId: string
  totalAmount: number
  isSelectable: boolean
  upsellItems: UpsellItem[]
}

const PaymentForm = ({ upsellId, reservationId, totalAmount, isSelectable, upsellItems }: Props) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    isSelectable && upsellItems.length > 0 ? upsellItems[0].id : null
  )
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value))
  }

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId)
  }

  // Calculate the total based on selection mode
  const calculatedTotal = isSelectable 
    ? (selectedItemId 
        ? upsellItems.find(item => item.id === selectedItemId)?.price || 0 
        : 0) * quantity
    : totalAmount * quantity

  const handlePay = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/upsells/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          upsellId,
          reservationId,
          quantity,
          selectedItemId: isSelectable ? selectedItemId : null
        }),
      })
      
      const data = await response.json()
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
      } else {
        setError(data.error || 'Failed to create payment intent')
      }
    } catch (err) {
      setError('Error processing payment request')
    } finally {
      setIsLoading(false)
    }
  }

  if (!clientSecret) {
    return (
      <div className="space-y-6">
        {isSelectable ? (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Select an option</h2>
            <div className="space-y-3">
              {upsellItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleItemSelect(item.id)}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedItemId === item.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      selectedItemId === item.id ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedItemId === item.id && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      {item.description && <div className="text-sm text-gray-500">{item.description}</div>}
                    </div>
                    <div className="font-bold">${item.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {!isSelectable && (
              <div className="mt-4 border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-200 pt-3 mt-3">
              <span>Total</span>
              <span>${calculatedTotal.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-200 pt-3">
              <span>Total</span>
              <span>${calculatedTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={isLoading || (isSelectable && !selectedItemId)}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
        >
          {isLoading ? 'Processing...' : 'Continue to Payment'}
        </button>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
    )
  }

  // Store selected item info for the checkout form
  // This allows us to access the item details after payment intent is created
  if (isSelectable && selectedItemId) {
    const selectedItem = upsellItems.find(item => item.id === selectedItemId)
    if (selectedItem) {
      // @ts-ignore - Custom property for sharing data between components
      window.selectedUpsellItem = selectedItem
      // @ts-ignore - Make all items available for the checkout form
      window.upsellItems = upsellItems
    }
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm 
        upsellId={upsellId} 
        reservationId={reservationId} 
        quantity={quantity} 
        totalAmount={calculatedTotal}
        selectedItemId={isSelectable ? selectedItemId : null}
        onGoBack={() => setClientSecret(null)}
      />
    </Elements>
  )
}

const CheckoutForm = ({ 
  upsellId, 
  reservationId, 
  quantity, 
  totalAmount,
  selectedItemId,
  onGoBack
}: { 
  upsellId: string
  reservationId: string
  quantity: number
  totalAmount: number
  selectedItemId: string | null
  onGoBack: () => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedItem, setSelectedItem] = useState<UpsellItem | null>(null)
  
  // Get the selected item details from the parent component
  useEffect(() => {
    if (selectedItemId && window.upsellItems) {
      const item = window.upsellItems.find(item => item.id === selectedItemId)
      if (item) {
        setSelectedItem(item)
      }
    } else if (window.selectedUpsellItem) {
      setSelectedItem(window.selectedUpsellItem)
    }
  }, [selectedItemId])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?upsellId=${upsellId}&reservationId=${reservationId}`,
          payment_method_data: {
            metadata: {
              upsellId,
              reservationId,
              quantity: quantity.toString(),
              selectedItemId: selectedItemId || ''
            }
          }
        },
      })
  
      if (error) {
        setError(error.message || 'An error occurred during payment')
      }
    } catch (err) {
      setError('Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="mt-6">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        {selectedItem && (
          <div className="mb-3 pb-3 border-b border-gray-200">
            <div className="font-medium text-gray-800">{selectedItem.name}</div>
            {selectedItem.description && (
              <div className="text-sm text-gray-500">{selectedItem.description}</div>
            )}
          </div>
        )}
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Quantity:</span>
          <span className="font-medium">{quantity}</span>
        </div>
        <button 
          type="button"
          onClick={onGoBack}
          className="text-blue-500 text-sm mt-2 mb-2 hover:text-blue-700 underline"
        >
          Change selection
        </button>
        <div className="flex justify-between text-lg font-bold text-gray-800">
          <span>Total:</span>
          <span>${totalAmount.toLocaleString()}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <PaymentElement />
        </div>
        
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}

export default PaymentForm