import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-extrabold mb-4 tracking-tight">House<span className="text-teal-400">Force</span></h3>
          <p className="text-slate-400 font-light leading-relaxed">
            Family run property reforming & keyholding services in Torrevieja. Quality first, always.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6 tracking-wide text-slate-100">Quick Links</h4>
          <ul className="space-y-3">
            <li><Link href="/services/construction" className="text-slate-400 hover:text-white transition-colors">Construction & Reforming</Link></li>
            <li><Link href="/services/keyholding" className="text-slate-400 hover:text-white transition-colors">Keyholding & Cleaning</Link></li>
            <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog & Showcases</Link></li>
            <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-6 tracking-wide text-slate-100">Contact</h4>
          <p className="text-slate-400 mb-2">Torrevieja, Spain</p>
          <p className="text-slate-400 mb-2">Paul: paul@houseforce.biz</p>
          <p className="text-slate-400">Paige: paige@houseforce.biz</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} HouseForce. All rights reserved.</p>
      </div>
    </footer>
  );
}
