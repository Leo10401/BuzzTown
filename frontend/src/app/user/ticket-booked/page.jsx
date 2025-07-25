'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

// Create a separate component for the ticket content
const TicketContent = () => {
  const searchParams = useSearchParams();
  const entryPassKey = searchParams.get('entryPassKey');
  const event = searchParams.get('event');
  const date = searchParams.get('date');
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    if (entryPassKey) setQrValue(entryPassKey);
  }, [entryPassKey]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Your Ticket is Booked!</h1>
      <div className="mb-4">
        <QRCodeCanvas value={qrValue || ''} size={200} />
      </div>
      <div className="mb-2 text-lg font-semibold">Entry Pass Key:</div>
      <div className="mb-4 text-blue-600 font-mono break-all">{entryPassKey}</div>
      <div className="mb-2 text-lg font-semibold">Event:</div>
      <div className="mb-4">{event}</div>
      <div className="mb-2 text-lg font-semibold">Date:</div>
      <div className="mb-4">{date ? new Date(date).toLocaleString() : ''}</div>
      <div className="mt-6 text-green-600 font-bold">
        Show this QR code at the event entrance for entry.
      </div>
    </div>
  );
};

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Main page component
export default function TicketBookedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <Suspense fallback={<Loading />}>
        <TicketContent />
      </Suspense>
    </div>
  );
}
