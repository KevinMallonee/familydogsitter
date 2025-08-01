'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

export default function StripeTest() {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripeKey, setStripeKey] = useState('');

  useEffect(() => {
    const checkStripe = async () => {
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      setStripeKey(key || 'Not found');
      
      if (key) {
        try {
          const stripe = await loadStripe(key);
          if (stripe) {
            setStripeLoaded(true);
            console.log('Stripe loaded successfully');
          } else {
            console.error('Stripe failed to load');
          }
        } catch (error) {
          console.error('Error loading Stripe:', error);
        }
      }
    };

    checkStripe();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Stripe Configuration Test</h3>
      <p><strong>Stripe Key:</strong> {stripeKey.substring(0, 20)}...</p>
      <p><strong>Stripe Loaded:</strong> {stripeLoaded ? '✅ Yes' : '❌ No'}</p>
    </div>
  );
} 