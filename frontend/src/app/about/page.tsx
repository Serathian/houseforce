export default function About() {
  return (
    <div className="max-w-5xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">About HouseForce</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
          Over two decades of dedication to quality property services in Torrevieja. Meet the family and team that makes it happen.
        </p>
      </div>

      <div className="space-y-20">
        {/* Paul's Section */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-blue-100 w-64 h-64 rounded-full flex items-center justify-center border-4 border-blue-900 shadow-xl overflow-hidden relative group">
               <span className="text-blue-900 font-bold text-xl group-hover:scale-110 transition-transform">Paul Reddy</span>
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-blue-900">Paul Reddy</h2>
              <span className="text-xl" title="Speaks English">🇬🇧</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-widest mb-6">Founder &amp; Managing Director</h3>
            <p className="text-slate-700 mb-4 text-lg leading-relaxed font-light">
              As the owner and head of HouseForce, Paul brings over 30 years of hands-on construction and project management experience to the table. Operating in Torrevieja for more than two decades, he has built a reputation for uncompromising quality and rock-solid reliability.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed font-light">
              Whether it&apos;s a complete villa reform or structural repairs, Paul oversees the business with an exacting &quot;Quality First&quot; standard that has become the hallmark of the HouseForce name.
            </p>
          </div>
        </div>

        {/* Skippy's Section */}
        <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-slate-200 w-64 h-64 rounded-full flex items-center justify-center border-4 border-slate-600 shadow-xl overflow-hidden relative group">
               <span className="text-slate-700 font-bold text-xl group-hover:scale-110 transition-transform">Gabriel (Skippy)</span>
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-slate-800">Gabriel &quot;Skippy&quot;</h2>
              <span className="text-xl" title="Speaks English and Spanish">🇬🇧 🇪🇸</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-widest mb-6">Operations Manager / Right-Hand Man</h3>
            <p className="text-slate-700 mb-4 text-lg leading-relaxed font-light">
              Gabriel, affectionately known to our clients as &quot;Skippy&quot;, is Paul&apos;s right-hand man. He has been a cornerstone of the HouseForce family for over 20 years, bringing immense local knowledge and operational expertise.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed font-light">
              Fully bilingual in English and Spanish, Skippy seamlessly bridges the gap between our clients, local suppliers, and craftsmen. His on-the-ground management ensures that projects run smoothly, on time, and without communication barriers.
            </p>
          </div>
        </div>

        {/* Paige's Section */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-teal-100 w-64 h-64 rounded-full flex items-center justify-center border-4 border-teal-600 shadow-xl overflow-hidden relative group">
               <span className="text-teal-800 font-bold text-xl group-hover:scale-110 transition-transform">Paige Reddy</span>
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-teal-800">Paige Reddy</h2>
              <span className="text-xl" title="Speaks English and Spanish">🇬🇧 🇪🇸</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-widest mb-6">Keyholding &amp; Cleaning Manager</h3>
            <p className="text-slate-700 mb-4 text-lg leading-relaxed font-light">
              Representing the next generation of HouseForce, Paige Reddy spearheads our property management division. Fully bilingual in English and Spanish, she brings modern efficiency and absolute trustworthiness to our clients.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed font-light">
              Paige coordinates our rigorous keyholding checks, emergency responses, and professional cleaning services. She understands that trusting someone with the keys to your overseas home is a major decision, and she ensures your property is secure, fresh, and ready for you the moment you arrive.
            </p>
          </div>
        </div>

        {/* Jake's Section */}
        <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-indigo-100 w-64 h-64 rounded-full flex items-center justify-center border-4 border-indigo-900 shadow-xl overflow-hidden relative group">
               <span className="text-indigo-900 font-bold text-xl group-hover:scale-110 transition-transform">Jake Reddy</span>
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-indigo-900">Jake Reddy</h2>
              <span className="text-xl" title="Speaks English">🇬🇧</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-widest mb-6">Head of Digital Systems &amp; Web Development</h3>
            <p className="text-slate-700 mb-4 text-lg leading-relaxed font-light">
              As part of the next generation of the Reddy family, Jake designs, builds, and maintains the digital infrastructure and online presence for HouseForce.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed font-light">
              Combining modern web technologies with an intuitive user experience, Jake ensures that property owners in Torrevieja and across Europe can seamlessly connect with our team, request service quotes, and stay informed on their property reforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

