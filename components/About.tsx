'use client';

export default function About() {
  return (
    <section className="py-20 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Family Dog Sitter?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary-700 mb-6">
              Your Dogs Deserve the Best Care
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Family Dog Sitter, we understand that your dogs are cherished family members. 
              That's why we provide loving, professional care that gives you peace of mind and 
              keeps your furry friends happy.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our experienced dog sitters are passionate dog lovers who treat every dog as if 
              they were our own. We maintain consistent routines, provide plenty of attention, 
              and ensure your dogs feel secure and loved.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you need daily visits, overnight care, or extended dog sitting services, 
              we're here to help. Your dogs will receive individualized attention and care 
              tailored to their specific needs and personality.
            </p>
            <div className="bg-primary-50 p-6 rounded-2xl">
              <p className="text-primary-800 font-semibold">
                ✓ Licensed & Insured<br />
                ✓ Experienced Dog Caregivers<br />
                ✓ Daily Updates & Photos<br />
                ✓ Flexible Scheduling<br />
                ✓ Emergency Care Available
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-600 to-accent-600 h-96 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-pulse">🐕 🏠 ❤️</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 