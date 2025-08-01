'use client';

import { useEffect, useState } from 'react';
import { Service } from '@/types';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

export default function ServicesPage() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Dog Care Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional, personalized care for your beloved dogs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-primary-200"
            >
              <div className="text-center">
                <div className="text-6xl mb-6 animate-bounce">
                  {service.name.includes('Overnight') ? '🌙' : '🏠'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.name}
                </h3>
                <div className="text-3xl font-bold text-primary-600 mb-4">
                  {formatPrice(service.price)}/Day
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="text-sm text-gray-500">
                  Duration: {service.duration_hours} hours
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Services are currently being loaded...
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 