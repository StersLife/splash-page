// app/success/page.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Success',
};

type SuccessPageProps = {
  searchParams: {
    upsellId?: string;
    reservationId?: string;
    payment_intent?: string;
    redirect_status?: string;
  };
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const {
    upsellId = '',
    reservationId = '',
    payment_intent = '',
    redirect_status = '',
  } =  searchParams;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-green-500 text-4xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h1>
        <p className="text-gray-600 mb-6">Thank you! Your payment has been processed.</p>

        <div className="text-left text-sm text-gray-700 space-y-2">
          <p><strong>Upsell ID:</strong> {upsellId}</p>
          <p><strong>Reservation ID:</strong> {reservationId}</p>
          <p><strong>Payment Intent:</strong> {payment_intent}</p>
          <p><strong>Status:</strong> {redirect_status}</p>
        </div>
      </div>
    </div>
  );
}
