export default function Contact() {
  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Let's Talk</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you need a full villa reform or a trusted team to hold your keys, Paul and Paige are ready to help.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 md:p-14 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-x-1/2 -translate-y-1/2"></div>
          
          <form className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Name</label>
                <input type="text" id="name" className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 border bg-slate-50 text-slate-900 transition-colors hover:bg-white" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Email</label>
                <input type="email" id="email" className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 border bg-slate-50 text-slate-900 transition-colors hover:bg-white" placeholder="john@example.com" />
              </div>
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">How can we help you?</label>
              <div className="relative">
                <select id="department" className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 border bg-slate-50 text-slate-900 appearance-none transition-colors hover:bg-white">
                  <option value="construction">Construction & Reforming (Paul)</option>
                  <option value="keyholding">Keyholding & Cleaning (Paige)</option>
                  <option value="other">General Inquiry</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase">Message</label>
              <textarea id="message" rows={6} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 border bg-slate-50 text-slate-900 transition-colors hover:bg-white resize-none" placeholder="Tell us about your project or property..."></textarea>
            </div>
            
            <div className="pt-4">
              <button type="submit" className="w-full md:w-auto md:px-12 flex justify-center py-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
