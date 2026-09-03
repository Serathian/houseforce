import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-extrabold text-blue-900 tracking-tight">
              House<span className="text-teal-600">Force</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-semibold transition-colors">Home</Link>
            <Link href="/about" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-semibold transition-colors">About Us</Link>
            <Link href="/services/construction" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-semibold transition-colors">Construction</Link>
            <Link href="/services/keyholding" className="text-slate-600 hover:text-teal-600 px-3 py-2 text-sm font-semibold transition-colors">Keyholding</Link>
            <Link href="/blog" className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-semibold transition-colors">Blog</Link>
            <Link href="/contact" className="bg-blue-900 text-white hover:bg-blue-800 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
