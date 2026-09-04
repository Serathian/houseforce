import { teamMembers } from "@/data/team";
import { Mail, CheckCircle2, ShieldCheck, HeartHandshake, History, Award, ScrollText, Users } from "lucide-react";
import { Link } from "next-view-transitions";

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      
      {/* Full-Width Spotlight Team Picture Hero */}
      <section className="relative w-full h-[55vh] sm:h-[65vh] min-h-[420px] overflow-hidden bg-slate-950 flex items-end justify-center mb-16">
        {/* Full-Width Background Spotlight Image */}
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2400&auto=format&fit=crop" 
          alt="The HouseForce Team" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Subtle Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />

        {/* Clean, Uncluttered Text Overlay */}
        <div className="relative z-10 text-center text-white px-4 pb-12 sm:pb-16 max-w-4xl mx-auto">
          <span className="text-teal-300 font-bold text-xs uppercase tracking-widest block mb-3 drop-shadow-md">
            Torrevieja &amp; Orihuela Costa
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
            The HouseForce Family
          </h1>
          <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            20+ years of British craftsmanship and property care in Torrevieja. Direct, family-owned service with zero sub-contractors.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Story Section: From 2004 to Today */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-900 text-white rounded-2xl">
              <History className="w-6 h-6" />
            </div>
            <div>
              <span className="text-blue-900 font-bold text-xs uppercase tracking-widest block">How It All Started</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">The 20-Year Torrevieja Journey</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-700 font-light leading-relaxed text-base">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <span className="text-blue-900 font-extrabold text-sm uppercase tracking-wider block mb-2">2004 — The Founding</span>
              <p>
                Paul Reddy moved to Torrevieja with over a decade of UK trade mastery. Seeing how overseas homeowners struggled with unannounced costs and language barriers, he founded HouseForce to deliver hands-on, itemized British craftsmanship.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <span className="text-teal-800 font-extrabold text-sm uppercase tracking-wider block mb-2">Expanding Local Presence</span>
              <p>
                As demand grew across Orihuela Costa, Skippy joined as operations liaison—bridging local Spanish suppliers and municipal permit logistics. Paige Reddy expanded our dedicated keyholding and holiday home care division.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
              <span className="text-indigo-900 font-extrabold text-sm uppercase tracking-wider block mb-2">Today &amp; The Future</span>
              <p>
                Now backed by Jake Reddy running digital quote systems and transparent site logs, HouseForce remains 100% family-run. When you hire us, Paul or Paige is personally accountable for your home.
              </p>
            </div>
          </div>
        </div>

        {/* The HouseForce Family Promise */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-blue-900 font-bold text-xs uppercase tracking-widest block mb-2">Our Operating Philosophy</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">The 4 HouseForce Family Guarantees</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] flex gap-5 items-start">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">1. Direct Family Oversight</h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed">
                  Zero sub-contractor lotteries. Paul personally manages structural building works, and Paige coordinates keyholding and cleaning. You deal directly with our family.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] flex gap-5 items-start">
              <div className="p-3 bg-teal-50 text-teal-900 rounded-2xl shrink-0">
                <ScrollText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">2. Itemized Written Quotes</h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed">
                  Every quote is fully broken down by materials, labor, and timeline. No hidden surcharges, zero unexpected additions, and clear contracts in plain English.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] flex gap-5 items-start">
              <div className="p-3 bg-slate-100 text-slate-900 rounded-2xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">3. Town Hall &amp; Legal Compliance</h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed">
                  Skippy handles local Spanish municipal permits (Licencia de Obra), architect plans, and civil liability insurance so your reform is 100% legal.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] flex gap-5 items-start">
              <div className="p-3 bg-indigo-50 text-indigo-900 rounded-2xl shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">4. 100% Workmanship Proof</h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed">
                  We publish real job walkthroughs, step-by-step reform photos, and property care updates directly on our website so you can verify our quality anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Family Profiles */}
        <div id="team" className="space-y-12 mb-20 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-blue-900 font-bold text-xs uppercase tracking-widest block mb-2">Who You Work With</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Meet the Team Members</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.09)] transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
              >
                <div className="sm:w-2/5 h-72 sm:h-auto relative overflow-hidden bg-slate-100 shrink-0">
                  <img 
                    src={member.image} 
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {member.languages.map((lang, idx) => (
                      <span key={idx} className="bg-white/90 backdrop-blur-md text-slate-900 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      {member.experience}
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">
                      {member.name}
                    </h3>
                    <p className="text-blue-900 font-bold text-xs uppercase tracking-wider mb-4">
                      {member.role}
                    </p>
                    <p className="text-slate-600 text-sm font-light leading-relaxed mb-6">
                      {member.bio}
                    </p>
                  </div>

                  {member.email && (
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Direct Contact:</span>
                      <a 
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-950 hover:text-blue-700 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-blue-900" />
                        <span>{member.email}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency & Authoring Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] mb-20">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-blue-900 font-bold text-xs uppercase tracking-widest block mb-2">100% Workmanship Transparency</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Written &amp; Documented by Our Family</h2>
            <p className="text-slate-600 text-base leading-relaxed font-light">
              To demonstrate the quality of our building reforms and keyholding services, Paul, Paige, Skippy, and Jake regularly author detailed project logs, photo walkthroughs, and property care advice in our blog.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
              <div>
                <span className="text-blue-900 font-bold text-xs uppercase tracking-wider block mb-1">Paul Reddy</span>
                <h4 className="font-extrabold text-slate-900 text-base mb-2">Reform Case Studies</h4>
                <p className="text-slate-600 text-xs font-light leading-relaxed mb-4">
                  Technical notes on damp-proof tiling, structural extensions, and kitchen/bathroom overhauls.
                </p>
              </div>
              <Link href="/blog" className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1">
                <span>Read Paul&apos;s Logs</span> &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
              <div>
                <span className="text-teal-800 font-bold text-xs uppercase tracking-wider block mb-1">Paige Reddy</span>
                <h4 className="font-extrabold text-slate-900 text-base mb-2">Property Care Guides</h4>
                <p className="text-slate-600 text-xs font-light leading-relaxed mb-4">
                  Practical advice for holiday homeowners, storm preparation checklists, and guest handovers.
                </p>
              </div>
              <Link href="/blog" className="text-xs font-bold text-teal-800 hover:underline flex items-center gap-1">
                <span>Read Paige&apos;s Guides</span> &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
              <div>
                <span className="text-slate-800 font-bold text-xs uppercase tracking-wider block mb-1">Gabriel &quot;Skippy&quot;</span>
                <h4 className="font-extrabold text-slate-900 text-base mb-2">Permits &amp; Town Hall Notes</h4>
                <p className="text-slate-600 text-xs font-light leading-relaxed mb-4">
                  Navigating Torrevieja municipal planning, Licencia de Obra permissions, and supplier logistics.
                </p>
              </div>
              <Link href="/blog" className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1">
                <span>Read Skippy&apos;s Notes</span> &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
              <div>
                <span className="text-indigo-900 font-bold text-xs uppercase tracking-wider block mb-1">Jake Reddy</span>
                <h4 className="font-extrabold text-slate-900 text-base mb-2">Digital Systems &amp; Web</h4>
                <p className="text-slate-600 text-xs font-light leading-relaxed mb-4">
                  Building digital tools for quote requests, owner communication, and web platform updates.
                </p>
              </div>
              <Link href="/blog" className="text-xs font-bold text-indigo-900 hover:underline flex items-center gap-1">
                <span>Read Jake&apos;s Updates</span> &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Contact CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-14 text-center relative overflow-hidden shadow-xl">
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Ready to Talk Property with Our Family?</h2>
          <p className="text-slate-300 text-lg max-w-xl mx-auto font-light leading-relaxed mb-8">
            Whether you are planning a villa reform or seeking reliable keyholding in Torrevieja, Paul and Paige are here to help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-white text-slate-900 font-extrabold py-4 px-8 rounded-full hover:bg-slate-100 transition-colors shadow-lg text-sm"
          >
            Get in Touch with Paul &amp; Paige
          </Link>
        </div>

      </div>
    </div>
  );
}
