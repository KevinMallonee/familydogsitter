'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Service, Booking } from '@/types';
import BookingCalendar from '@/components/BookingCalendar';
import BookingForm from '@/components/BookingForm';

export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
    };

    const fetchData = async () => {
      try {
        // Fetch services
        const { data: servicesData } = await supabase
          .from('services')
          .select('*')
          .order('price', { ascending: true });

        // Fetch bookings for calendar
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .neq('status', 'cancelled');

        setServices(servicesData || []);
        setBookings(bookingsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Book Your Dog Care
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your preferred service and schedule your dog's care
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Services</h2>
            <BookingForm services={services} user={user} />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calendar</h2>
            <BookingCalendar bookings={bookings} />
          </div>
        </div>
      </div>
    </div>
  );
} 