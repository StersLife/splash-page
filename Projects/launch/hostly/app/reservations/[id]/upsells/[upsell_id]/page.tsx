import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import PaymentForm from '@/components/PaymentForm'
import { isUpsellVisible } from '@/lib/upsell-utils'

type Props = {
  params: { 
    id: string,
    upsell_id: string 
  }
}

const UpsellPurchasePage = async ({ params }: Props) => {
  const { id, upsell_id } = params
  
  const supabase = await createClient()
  
  // First, fetch the reservation details
  const { data: reservation, error: reservationError } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single()
    
  if (reservationError || !reservation) {
    console.error('Reservation not found:', reservationError)
    notFound()
  }

  // Then fetch the upsell with its visibility rules
  const { data: upsell, error } = await supabase
    .from('upsells')
    .select('*, upsell_items (*), upsell_visibility_rules (*)')
    .eq('id', upsell_id)
    .single()

  if (error || !upsell) {
    console.error(error)
    notFound()
  }

  // Check if this upsell is currently visible based on rules
  const isVisible = isUpsellVisible(upsell, reservation)
  
  // If not visible, redirect to a not available page
  // if (!isVisible) {
  //   redirect(`/upsell-not-available?reservationId=${id}`)
  // }

  const total = upsell.upsell_items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{upsell.name || 'Complete Your Purchase'}</h1>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          {upsell.is_selectable ? 'Available Options' : 'Order Summary'}
        </h2>
        
        {!upsell.is_selectable && (
          <ul className="space-y-3">
            {upsell.upsell_items.map((item) => (
              <li key={item.id} className="flex justify-between pb-2 border-b border-gray-200 last:border-b-0">
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  {item.description && (
                    <p className="text-gray-500 text-xs mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="text-right font-medium text-gray-800 ml-4">
                  ${item.price.toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PaymentForm 
        upsellId={upsell_id} 
        reservationId={id}
        totalAmount={total}
        isSelectable={upsell.is_selectable}
        upsellItems={upsell.upsell_items}
      />
    </div>
  )
}

export default UpsellPurchasePage