import React, { useState } from 'react';

const Opportunities = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  // Sample opportunities data
  const opportunities = [
    {
      id: 1,
      category: 'mentorship',
      title: 'Career Mentorship Program',
      type: 'Mentorship',
      description: 'One-on-one mentoring with industry professionals and successful alumni',
      details: 'Get paired with an experienced mentor in your field of interest. Receive guidance on career development, skill building, and industry navigation. Monthly meetings and ongoing support throughout your career journey.',
      benefits: ['1-on-1 guidance', 'Industry insights', 'Resume review', 'Interview prep', 'Networking access'],
      duration: 'Ongoing',
      commitment: '2 hours/month'
    },
    // ... (all other opportunities unchanged)
  ];

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'mentorship', label: 'Mentorship' },
    { id: 'internship', label: 'Internships' },
    { id: 'scholarship', label: 'Scholarships' },
    { id: 'fellowship', label: 'Fellowships' },
    { id: 'networking', label: 'Workshops' },
    { id: 'job', label: 'Jobs' },
    { id: 'leadership', label: 'Leadership' }
  ];

  const filteredOpportunities = selectedCategory === 'all'
    ? opportunities
    : opportunities.filter(opp => opp.category === selectedCategory);

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Page Header */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-accent-gold mb-4">Opportunities & Mentorships</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Unlock your potential with career guidance, internships, scholarships, and professional development
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-accent-gold mb-6">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-accent-gold text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Opportunities List */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Opportunities Found</h3>
            <p className="text-gray-400">Try selecting a different category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOpportunities.map(opp => (
              <div
                key={opp.id}
                onClick={() => toggleExpanded(opp.id)}
                className={`bg-gray-800 rounded-lg p-6 border border-gray-700 transition ${
                  expandedId === opp.id ? 'border-accent-gold shadow-lg' : 'cursor-pointer hover:shadow-lg hover:border-accent-goldLight'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-accent-gold">{opp.title}</h2>
                      <span className="px-3 py-1 bg-accent-gold text-black text-sm font-semibold rounded">
                        {opp.type}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{opp.description}</p>

                    {/* Expandable Content */}
                    {expandedId === opp.id && (
                      <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
                        <div>
                          <h3 className="font-bold text-white mb-2">About This Opportunity</h3>
                          <p className="text-gray-300">{opp.details}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-bold text-white mb-2">Key Benefits</h3>
                            <ul className="space-y-2 text-gray-300">
                              {opp.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex gap-2">
                                  <span className="text-accent-gold">✓</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-bold text-white mb-2">Program Details</h3>
                            <div className="space-y-2 text-gray-300">
                              <p><span className="font-semibold text-white">Duration:</span> {opp.duration}</p>
                              <p><span className="font-semibold text-white">Time Commitment:</span> {opp.commitment}</p>
                            </div>
                          </div>
                        </div>

                        <button className="w-full md:w-auto bg-accent-gold text-black px-6 py-3 rounded font-bold hover:bg-accent-goldLight transition">
                          Learn More & Apply
                        </button>
                      </div>
                    )}

                    {expandedId !== opp.id && (
                      <div className="flex items-center gap-2 text-accent-gold">
                        <span className="text-sm font-semibold">Click to expand</span>
                        <span>↓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-accent-gold mb-12">How to Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="text-xl font-bold text-white mb-3">Explore</h3>
              <p className="text-gray-300 text-sm">
                Browse our comprehensive list of opportunities and mentorship programs designed for your growth
              </p>
            </div>
            {/* ... Repeat for other three cards (2️⃣ Apply, 3️⃣ Connect, 4️⃣ Thrive) */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="text-xl font-bold text-white mb-3">Apply</h3>
              <p className="text-gray-300 text-sm">
                Submit your application with your profile, resume, and why you're interested in the opportunity
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="text-xl font-bold text-white mb-3">Connect</h3>
              <p className="text-gray-300 text-sm">
                Get matched with mentors, employers, or scholarship committees who believe in your potential
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
              <div className="text-4xl mb-4">4️⃣</div>
              <h3 className="text-xl font-bold text-white mb-3">Thrive</h3>
              <p className="text-gray-300 text-sm">
                Gain experience, build your network, and accelerate your career with ongoing support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-accent-gold mb-12">Alumni Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card structure repeated for each story */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-gold flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-black text-lg">SA</span>
              </div>
              <div>
                <h3 className="font-bold text-white">Sarah Anyang</h3>
                <p className="text-sm text-gray-400">Class of 2015 | Tech Entrepreneur</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              "Through the Entrepreneurship Mentorship program, I got connected with an experienced founder who believed in my vision. 
              That guidance helped me raise my first round of funding and build a successful startup."
            </p>
            <p className="text-accent-gold font-semibold">→ Now leads a 50-person tech company</p>
          </div>
          {/* ... (other success stories unchanged, similar structure) */}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-accent-gold mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {/* Repeated Card structure for each FAQ */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="font-bold text-white mb-2 text-lg">Who is eligible for these opportunities?</h3>
              <p className="text-gray-300">
                Most opportunities are open to NMS alumni of any graduation year, current students, and in some cases, 
                prospective students. Some programs have specific requirements (e.g., scholarships require admission to higher education).
              </p>
            </div>
            {/* ... (other FAQs unchanged) */}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Advance Your Career?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Create your profile, explore opportunities, and get connected with mentors and employers 
          who are ready to invest in your success.
        </p>
        <a href="/signup" className="bg-accent-gold text-black px-8 py-3 rounded font-bold hover:bg-accent-goldLight transition inline-block">
          Join the Network Now
        </a>
      </section>
    </div>
  );
};

export default Opportunities;