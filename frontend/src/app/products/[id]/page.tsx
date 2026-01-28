import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Zap, Download } from 'lucide-react';
import BuyButton from '@/components/BuyButton';

async function getProduct(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Product not found');
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function ProductPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
    const resolvedParams = await Promise.resolve(params);
    const product = await getProduct(resolvedParams.id);

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center">
                <div className="text-center p-8 bg-white/5 border border-red-500/20 rounded-3xl backdrop-blur-sm">
                    <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                    <p className="text-gray-400 mb-8">This digital asset might have been removed.</p>
                    <Link href="/shop" className="px-6 py-3 bg-purple-600 rounded-full font-semibold hover:bg-purple-700 transition">
                        <ArrowLeft className="w-5 h-5 inline mr-2" /> Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden relative selection:bg-purple-500/30">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Nav */}
            <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
                <Link href="/shop" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" /> All Products
                </Link>
                <span className="text-gray-500 font-medium">ProShop</span>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-16 items-start">
                {/* Left: Image & Preview */}
                <div className="w-full">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border border-white/10 group relative shadow-2xl">
                        {product.previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={product.previewUrl}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                <Download className="w-16 h-16 mb-4 opacity-50" />
                                <p>No preview available</p>
                            </div>
                        )}
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>

                {/* Right: Info & Checkout */}
                <div className="flex flex-col">
                    <span className="text-purple-400 font-semibold tracking-wide uppercase text-sm mb-4 inline-block">
                        {product.category}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg border-2 border-[#0A0A0B] shadow-sm">
                            {product.seller?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Created by</p>
                            <p className="font-semibold">{product.seller?.name || 'Anonymous Creator'}</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                        <div className="text-3xl font-black text-white mb-2">
                            ${product.price.toFixed(2)}
                        </div>
                        <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-purple-400" /> Instant Access
                        </p>

                        {/* Buy Button */}
                        <BuyButton productId={product.id} />
                        <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Secure direct checkout
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">About this product</h2>
                        <div className="prose prose-invert prose-purple max-w-none text-gray-300">
                            <p className="whitespace-pre-line leading-relaxed">
                                {product.description || 'The creator has not provided a description for this product.'}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
