import Link from 'next/link';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-purple-500/30 overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar Minimal */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-purple-500" /> ProShop
        </div>
        <div className="flex gap-4">
          <Link href="/api/auth/login" className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            Login
          </Link>
          <Link href="/dashboard/seller" className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-gray-200 transition-colors">
            Start Selling
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          ProShop 2.0 is now live
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
          Monetize your <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">Digital Future.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-12">
          The ultimate platform to sell ebooks, software, and video courses. Highly secure, incredibly fast, and delightfully designed.
        </p>

        <div className="flex items-center justify-center gap-6">
          <Link href="/dashboard/seller" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 overflow-hidden">
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative flex items-center gap-2">
              Go to Seller Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </main>

      {/* Details Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
          <p className="text-gray-400">Built on Next.js 15 and NestJS, your store loads instantly to maximize conversion rates.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6 text-pink-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Auth0 Secured</h3>
          <p className="text-gray-400">Enterprise-grade security perfectly integrated. JWT strategies block unauthorized access.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
            <ShoppingBag className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Digital Delivery</h3>
          <p className="text-gray-400">Automatically serve large files from local disk securely the moment a customer pays.</p>
        </div>
      </section>
    </div>
  );
}
