'use client';

import { useEffect, useState } from 'react';
import { Service } from '@/types';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function Pricing() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('price', { ascending: true });

        if (error) {
          console.error('Error fetching services:', error);
        } else {
          setServices(data || []);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-primary-700 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary-700 to-primary-900 text-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Dog Care Services
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Choose the perfect care option for your beloved dogs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-3xl p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl ${
                index === 1 ? 'scale-105 border-secondary-400' : ''
              }`}
            >
              <div className="text-5xl mb-6 animate-float">
                {service.name.includes('Overnight') ? '🌙' : '🏠'}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-secondary-300">
                {service.name}
              </h3>
              <div className="text-4xl font-bold mb-2">
                {formatPrice(service.price)}/Day
              </div>
              <p className="text-lg opacity-80 mb-6">Per Dog</p>
              
              <ul className="text-left space-y-3 mb-8">
                {service.name.includes('Overnight') ? (
                  <>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      Full overnight care
                    </li>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      24/7 supervision
                    </li>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      Comfortable home environment
                    </li>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      Regular feeding and walks
                    </li>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      Medication administration
                    </li>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      Daily photos and updates
                    </li>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      Emergency care available
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      In-home pet sitting visits
                    </li>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      Daily feeding and hydration
                    </li>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      Exercise and playtime
                    </li>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      Medication administration
                    </li>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      Daily updates with photos
                    </li>
                    <li className="flex items-center">
                      <span className="text-secondary-400 mr-3">✓</span>
                      Flexible scheduling
                    </li>
                  </>
                )}
              </ul>

              <Link
                href="/book"
                className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-primary-900 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-block"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-lg">
              <span className="font-bold text-secondary-300">Custom pricing available</span> for extended stays, multiple dogs, and special care requirements. Contact us for personalized quotes!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 