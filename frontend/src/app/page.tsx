import Link from 'next/link';
import SpinningWheel from '@/components/SpinningWheel';

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-slate-50 min-h-screen">
      {/* Modern Split-Path Hero Section */}
      <section className="relative w-full flex flex-col md:flex-row min-h-[85vh]">
        <SpinningWheel />
        
        {/* Construction Side (Paul) */}
        <Link href="/services/construction" className="relative w-full md:w-1/2 group overflow-hidden cursor-pointer flex flex-col justify-center items-center p-12 text-center min-h-[50vh] md:min-h-full">
          {/* Background image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2942&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
          {/* Color overlay */}
          <div className="absolute inset-0 bg-blue-900/70 transition-colors duration-500 group-hover:bg-blue-900/50"></div>
          
          <div className="relative z-10 flex flex-col items-center transform transition-transform duration-500 group-hover:-translate-y-2">
            <span className="text-blue-200 font-semibold tracking-wider uppercase text-sm mb-4 drop-shadow-md">Led by Paul Reddy</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight drop-shadow-lg">Construction<br/>& Reforming</h2>
            <p className="text-lg text-blue-50 mb-8 max-w-sm font-light drop-shadow-md">
              30+ years of expertise. "Quality First" property renovations in Torrevieja.
            </p>
            <span className="inline-flex items-center text-white font-bold group-hover:text-blue-200 transition-colors drop-shadow-md">
              Explore Construction 
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </div>
        </Link>

        {/* Keyholding Side (Paige) */}
        <Link href="/services/keyholding" className="relative w-full md:w-1/2 group overflow-hidden cursor-pointer flex flex-col justify-center items-center p-12 text-center min-h-[50vh] md:min-h-full">
           {/* Background image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
          {/* Color overlay */}
          <div className="absolute inset-0 bg-teal-900/75 transition-colors duration-500 group-hover:bg-teal-900/60"></div>
          
          <div className="relative z-10 flex flex-col items-center transform transition-transform duration-500 group-hover:-translate-y-2">
            <span className="text-teal-200 font-semibold tracking-wider uppercase text-sm mb-4 drop-shadow-md">Managed by Paige</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight drop-shadow-lg">Keyholding<br/>& Cleaning</h2>
            <p className="text-lg text-teal-50 mb-8 max-w-sm font-light drop-shadow-md">
              Total peace of mind for your Spanish property with meticulous cleaning and security.
            </p>
            <span className="inline-flex items-center text-white font-bold group-hover:text-teal-200 transition-colors drop-shadow-md">
              Explore Keyholding 
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </div>
        </Link>
      </section>

      {/* Trust Section */}
      <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-1/2 h-full bg-slate-50 -skew-x-12 transform -translate-x-1/2 -z-10"></div>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-slate-900 tracking-tight">A True Family Business</h2>
          <p className="text-slate-600 text-xl leading-relaxed font-light">
            For over 20 years, HouseForce has been the trusted name in Torrevieja property services. 
            By dividing our expertise—<strong className="font-semibold text-blue-900">Paul</strong> heading up all major construction and reforming, while <strong className="font-semibold text-teal-700">Paige</strong> ensures your home is spotless and secure—we guarantee that every aspect of your property is handled by a dedicated specialist who treats your home like their own.
          </p>
        </div>
      </section>
    </div>
  );
}
