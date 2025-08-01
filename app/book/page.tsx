'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Service } from '@/types';
import BookingForm from '@/components/BookingForm';
import Link from 'next/link';
import StripeTest from '@/components/StripeTest';
import { useRouter } from 'next/navigation';

export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  const handlePaymentSuccess = () => {
    // Redirect to confirmation page or show success message
    router.push('/book/confirmation');
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if user is logged in via localStorage (authenticated user)
        const storedUser = localStorage.getItem('user');
        const storedSession = localStorage.getItem('session');
        
        if (storedUser && storedSession) {
          const userData = JSON.parse(storedUser);
          const sessionData = JSON.parse(storedSession);
          
          // Check if session is still valid
          if (sessionData.expires_at && new Date(sessionData.expires_at * 1000) > new Date()) {
            setUser(userData);
            setIsAuthenticated(true);
            setLoading(false);
            return;
          } else {
            // Session expired, clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('session');
          }
        }

        // Check Supabase auth
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        } else {
          // Create a simple guest user object instead of trying anonymous auth
          const guestUser = {
            id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            email: null,
            isGuest: true
          };
          setUser(guestUser);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Create a simple guest user object as fallback
        const guestUser = {
          id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          email: null,
          isGuest: true
        };
        setUser(guestUser);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

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

    checkAuth();
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
          <p className="text-xl text-gray-600 mb-6">
            Choose your preferred service and schedule
          </p>
          
          {!isAuthenticated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <p className="text-blue-800 mb-2">
                <strong>Guest Booking:</strong> You're booking as a guest. 
              </p>
              <p className="text-blue-700 text-sm mb-3">
                Create an account to save your information and view your booking history.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link 
                  href="/signup" 
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                  Create Account
                </Link>
                <Link 
                  href="/login" 
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Available Services
            </h2>
            <BookingForm services={services} user={user} />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Calendar & Availability
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-gray-600">Calendar view coming soon...</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        {/* showPaymentForm && bookingId && totalAmount && ( */}
        {/*   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"> */}
        {/*     <div className="max-w-md w-full"> */}
        {/*       <PaymentForm */}
        {/*         bookingId={bookingId} */}
        {/*         amount={totalAmount} */}
        {/*         isGuestBooking={!isAuthenticated} */}
        {/*         guestInfo={guestInfo} */}
        {/*         serviceId={selectedService?.id ? parseInt(selectedService.id.toString()) : undefined} */}
        {/*         onSuccess={handlePaymentSuccess} */}
        {/*         onCancel={() => setShowPaymentForm(false)} */}
        {/*       /> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* ) */}

        {/* Temporary Stripe Test */}
        <div className="mt-8">
          <StripeTest />
        </div>
      </div>
    </div>
  );
} 