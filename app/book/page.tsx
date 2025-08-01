'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Service } from '@/types';
import BookingCalendar from '@/components/BookingCalendar';
import BookingForm from '@/components/BookingForm';

export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
        } else {
          // Create anonymous user for guest bookings
          const { data: { user: anonymousUser }, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error('Error creating anonymous user:', error);
            setError('Failed to create guest session');
          } else if (anonymousUser) {
            setUser(anonymousUser);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setError('Authentication error');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('price');

        if (error) {
          console.error('Error fetching services:', error);
          setError('Failed to load services');
        } else {
          setServices(data || []);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services');
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking system...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl max-w-2xl mx-auto">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Dog's Stay
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your preferred service and dates for your furry friend's care
          </p>
        </div>

        {!user.email && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl max-w-2xl mx-auto">
            <p className="text-blue-800">
              💡 <strong>Guest Booking:</strong> You can book without creating an account. 
              We'll collect your contact information during the booking process.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h2>
            <BookingForm services={services} user={user} />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calendar View</h2>
            <BookingCalendar />
          </div>
        </div>
      </div>
    </div>
  );
} 