import Link from 'next/link';

export default function KeyholdingPage() {
  const benefits = [
    {
      title: 'Worry-Free Holiday Homes',
      desc: 'Leaving your property empty can be stressful. We ensure your holiday home or rental is secure, well-maintained, and pristine.',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      title: 'Meet & Greet',
      desc: 'We provide a warm welcome for you or your rental guests, handing over keys and offering local advice to ensure a perfect stay.',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
    {
      title: 'Deep Cleaning & Changeovers',
      desc: 'Immaculate cleaning services between guest stays or before your arrival. Fresh linens, spotless rooms, and thorough ventilation.',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
    },
    {
      title: 'Effortless Upkeep',
      desc: 'Regular property inspections, plumbing flushes, and storm checks to catch and resolve issues before they become disasters.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-teal-800 text-white py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-800 to-teal-700 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <span className="text-teal-200 font-semibold tracking-wider uppercase text-sm mb-4 block">HouseForce Keyholding</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">Total Peace of Mind</h1>
          <p className="text-xl md:text-2xl text-teal-50 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            A worry-free solution for your holiday home. We manage the keys, the cleaning, and the upkeep, so you can just enjoy Spain.
          </p>
          <Link href="/contact" className="inline-block bg-white text-teal-900 font-bold py-4 px-10 rounded-full shadow-lg hover:bg-teal-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* The HouseForce Advantage */}
        <div className="bg-white rounded-3xl shadow-xl border border-teal-100 p-10 md:p-16 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-40 h-40 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-6 md:mb-0 shadow-inner">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
              </div>
            </div>
            <div className="md:w-2/3">
              <span className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-2 block">The HouseForce Advantage</span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Backed by Renovation Experts</h2>
              <p className="text-slate-700 text-lg leading-relaxed font-light mb-4">
                What sets our keyholding service apart is the extensive renovation and upkeep experience our team brings. Managed by Paige, but backed by Paul and Skippy's 30+ years of building expertise, we bring true peace of mind to property management.
              </p>
              <p className="text-slate-700 text-lg leading-relaxed font-light">
                If a pipe leaks, a storm causes damage, or a small inconvenience arises, you aren't just relying on a cleaner with a set of keys. You have a full construction and maintenance team ready to resolve the issue quickly and professionally.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300">
                <svg className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={benefit.icon} />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed font-light text-lg">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
