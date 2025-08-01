'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Service } from '@/types';
import { formatPrice } from '@/lib/utils';
import PaymentForm from './PaymentForm';

interface BookingFormProps {
  services: Service[];
  user: any;
}

export default function BookingForm({ services, user }: BookingFormProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const router = useRouter();

  const isGuest = user && !user.email;

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const calculateTotal = () => {
    if (!selectedService || !startTime || !endTime) return 0;
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const days = Math.ceil(hours / 24);
    
    return selectedService.price * days;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !startTime || !endTime) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate guest information if guest booking
    if (isGuest && (!guestName || !guestEmail || !guestPhone)) {
      alert('Please fill in all contact information');
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine notes with guest information if guest booking
      let finalNotes = notes;
      if (isGuest && guestName && guestEmail && guestPhone) {
        const guestInfo = `\n\n--- Guest Information ---\nName: ${guestName}\nEmail: ${guestEmail}\nPhone: ${guestPhone}`;
        finalNotes = (notes || '') + guestInfo;
      }

      // Create booking using the anonymous user's ID
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          startTime,
          endTime,
          notes: finalNotes,
          userId: user.id,
          totalAmount: calculateTotal(),
        }),
      });

      if (response.ok) {
        const booking = await response.json();
        setBookingId(booking.id);
        setShowPayment(true);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showPayment && bookingId) {
    return (
      <PaymentForm
        bookingId={bookingId}
        amount={calculateTotal()}
        onSuccess={() => router.push('/book/confirmation')}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Guest Information */}
        {isGuest && (
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="guestName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="guestEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="guestEmail"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="guestPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="guestPhone"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Service Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Service
          </label>
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedService?.id === service.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
                onClick={() => handleServiceSelect(service)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  <div className="text-lg font-bold text-primary-600">
                    {formatPrice(service.price)}/day
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-semibold text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-semibold text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            placeholder="Any special care instructions for your dog..."
          />
        </div>

        {/* Total */}
        {selectedService && startTime && endTime && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Amount:</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(calculateTotal())}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !selectedService || !startTime || !endTime || (isGuest && (!guestName || !guestEmail || !guestPhone))}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Booking...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
} 