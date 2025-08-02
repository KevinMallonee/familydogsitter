'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 overflow-hidden pt-16">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8 animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <div className="w-48 h-48 mx-auto mb-6 relative">
            <Image
              src="/logo-transparent.png"
              alt="Family Dog Sitter Logo"
              fill
              className="object-contain animate-logo-float"
              priority
            />
          </div>
        </div>

        {/* Company Name */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow-lg animate-slide-up opacity-0" 
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          Family Dog Sitter
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl mb-8 font-medium animate-slide-up opacity-0"
           style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          Professional, Caring Dog Sitting Services You Can Trust
        </p>

        {/* Service Area */}
        <div className="mb-8 animate-slide-up opacity-0"
             style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          <div className="inline-block bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-6 py-3">
            <p className="text-lg">
              Serving Sacramento • Folsom • Rancho Cordova • Roseville • Rocklin • El Dorado Hills & Surrounding Areas
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up opacity-0"
             style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
          <Link
            href="/book"
            className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-primary-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Book Dog Sitting
          </Link>
          <a
            href="sms:916-805-1250"
            className="bg-gradient-to-r from-accent-600 to-accent-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            💬 Text Us
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-arrow">
        <div className="text-3xl mb-2">⬇</div>
        <div className="text-sm">Learn More</div>
      </div>
    </section>
  );
} 