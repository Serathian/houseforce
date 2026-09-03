import Link from 'next/link';

export default function ConstructionPage() {
  const services = [
    {
      title: 'Renovations & Remodeling',
      desc: 'From single room updates to full villa renovations. We modernize your property while respecting its original character.',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
    {
      title: 'Kitchen Fitting',
      desc: 'Complete kitchen overhauls including custom cabinetry, worktops, tiling, and appliance installation.',
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
    },
    {
      title: 'Bathroom Installations',
      desc: 'Transform your bathroom with modern suites, walk-in showers, flawless tiling, and waterproofing.',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      title: 'Plumbing & Electrics',
      desc: 'Certified and safe electrical rewiring, lighting installations, and comprehensive plumbing services.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
      title: 'Planning & Project Management',
      desc: 'We take the stress out of building in Spain by managing planning permissions, architects, and site coordination.',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
    },
    {
      title: 'General Building Work',
      desc: 'Extensions, structural modifications, plastering, and exterior finishing tailored to your exact specifications.',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <span className="text-blue-300 font-semibold tracking-wider uppercase text-sm mb-4 block">HouseForce Construction</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">Expert Property Reforming</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            Led by Paul Reddy, our construction division brings over 30 years of uncompromising quality and craftsmanship to Torrevieja.
          </p>
          <Link href="/contact" className="inline-block bg-white text-blue-900 font-bold py-4 px-10 rounded-full shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Request a Quote
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Comprehensive Building Services</h2>
          <p className="text-slate-600 text-lg leading-relaxed font-light">
            We handle everything from the initial planning stages to the final coat of paint. With Paul personally overseeing every site alongside Skippy, you can be assured that no detail is overlooked.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed font-light">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
