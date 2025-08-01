'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Booking } from '@/types';
import { formatDateTime, formatPrice } from '@/lib/utils';

export default function ConfirmationPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
    };

    const fetchBooking = async () => {
      try {
        // In a real app, you'd get the booking ID from the URL params or payment success
        // For now, we'll show a generic confirmation
        setBooking({
          id: 'temp-booking-id',
          user_id: 'temp-user-id',
          service_id: 'temp-service-id',
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Thank you for your booking!',
          status: 'confirmed',
          total_amount: 40,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          service: {
            id: 'temp-service-id',
            name: 'Overnight Boarding',
            description: 'Full overnight care with 24/7 supervision',
            price: 40,
            duration_hours: 24,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        });
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchBooking();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for choosing Family Dog Sitter. Your booking has been confirmed.
          </p>
        </div>

        {booking && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Booking Details
              </h2>
              <p className="text-gray-600">
                We've sent a confirmation email with all the details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Service:</span>
                    <p className="text-gray-900">{booking.service?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Start Time:</span>
                    <p className="text-gray-900">{formatDateTime(booking.start_time)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">End Time:</span>
                    <p className="text-gray-900">{formatDateTime(booking.end_time)}</p>
                  </div>
                  {booking.notes && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Special Instructions:</span>
                      <p className="text-gray-900">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                    <p className="text-2xl font-bold text-primary-600">{formatPrice(booking.total_amount)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Booking ID:</span>
                    <p className="text-gray-900 font-mono text-sm">{booking.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-primary-50 rounded-2xl">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-primary-800">
                <li className="flex items-center">
                  <span className="mr-2">📧</span>
                  You'll receive a confirmation email with detailed instructions
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📱</span>
                  We'll send you updates and photos during your dog's stay
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  Contact us at (916) 805-1250 if you have any questions
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/profile')}
                className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-200"
              >
                View My Bookings
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 