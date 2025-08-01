'use client';

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      name: 'Nathan A.',
      date: 'Jul 8, 2023',
      stars: 5,
      text: 'Kevin provided me with pictures throughout the stay and kept me updated with how my pup was doing, I was reassured that my pup was well taken care of and most of all was having fun. Thank you Kevin!!',
      service: 'Dog Boarding'
    },
    {
      id: 2,
      name: 'Petra P.',
      date: 'Dec 2, 2023',
      stars: 5,
      text: 'Kevin is always great with our dog Riley. His availability is wonderful and response time is quick. Most importantly Riley always has fun and enjoys being with Kevin!',
      service: 'Dog Boarding'
    },
    {
      id: 3,
      name: 'Laura B.',
      date: 'Sep 13, 2023',
      stars: 5,
      text: 'Dogs are happy and tired what more could you ask for.',
      service: 'Dog Boarding'
    },
    {
      id: 4,
      name: 'Geoff B.',
      date: 'Dec 27, 2023',
      stars: 5,
      text: 'We were able to book for Christmas eve at the last minute. Close and great rate.',
      service: 'Dog Boarding'
    },
    {
      id: 5,
      name: 'Lorene W.',
      date: 'Dec 24, 2023',
      stars: 5,
      text: 'Thank you Kevin for taking care of Ru. She knows your family now and we appreciate you treating her well. We\'ll be back soon!',
      service: 'Dog Boarding'
    },
    {
      id: 6,
      name: 'Viv C.',
      date: 'Oct 4, 2023',
      stars: 5,
      text: 'Perfect Stay! Thanks again Kevin. Always a reliable and awesome sitter.',
      service: 'Dog Boarding'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-secondary-50 to-secondary-100" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Read reviews from pet parents who booked with Kevin M.
          </p>
        </div>

        {/* Reviews Summary */}
        <div className="text-center mb-12">
          <div className="bg-white/80 backdrop-blur-md border-2 border-secondary-200 rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary-700 mb-4">Rover Reviews</h3>
            <div className="text-4xl text-secondary-500 mb-4">⭐⭐⭐⭐⭐</div>
            <p className="text-xl font-semibold text-gray-700">5.0 out of 5.0 stars based on 50+ reviews</p>
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-primary-200"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{review.name}</div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
              </div>
              
              <div className="text-secondary-500 mb-4">
                {'⭐'.repeat(review.stars)}
              </div>
              
              <p className="text-gray-600 italic mb-4 leading-relaxed">
                "{review.text}"
              </p>
              
              <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                {review.service}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 