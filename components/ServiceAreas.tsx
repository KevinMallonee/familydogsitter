'use client';

export default function ServiceAreas() {
  const areas = [
    'Sacramento',
    'Folsom',
    'Rancho Cordova',
    'Roseville',
    'Rocklin',
    'El Dorado Hills',
    'Surrounding Areas'
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-accent-50 to-accent-100" id="areas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Service Areas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Proudly serving dogs and families throughout the greater Sacramento area
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {areas.map((area, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-accent-300"
            >
              <div className="text-2xl font-semibold text-gray-900">{area}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 