'use client';

export default function ServiceAreas() {
  const areas = [
    {
      name: 'Sacramento',
      icon: '🏛️',
      description: 'Capital city area'
    },
    {
      name: 'Folsom',
      icon: '🏞️',
      description: 'Lake & recreation area'
    },
    {
      name: 'Rancho Cordova',
      icon: '🏢',
      description: 'Business district'
    },
    {
      name: 'Roseville',
      icon: '🛍️',
      description: 'Shopping & residential'
    },
    {
      name: 'Rocklin',
      icon: '🏘️',
      description: 'Family communities'
    },
    {
      name: 'El Dorado Hills',
      icon: '⛰️',
      description: 'Foothills & nature'
    },
    {
      name: 'Surrounding Areas',
      icon: '🌆',
      description: 'Greater Sacramento region'
    }
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

        {/* Mobile-friendly grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {areas.map((area, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-accent-300 cursor-pointer"
            >
              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {area.icon}
              </div>
              
              {/* Area Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-accent-600 transition-colors duration-300">
                {area.name}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 