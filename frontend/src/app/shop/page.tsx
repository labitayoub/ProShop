/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Image as ImageIcon } from 'lucide-react';

// Fetch products from our NestJS Backend (Server-Side Rendering)
async function getProducts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products`, {
            cache: 'no-store' // Always fetch fresh data
        });
        if (!res.ok) throw new Error('Failed to fetch data');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function ShopPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-purple-500/30 overflow-hidden relative">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Basic Nav */}
            <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Home
                </Link>
                <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
                    <ShoppingBag className="w-8 h-8 text-purple-500" /> ProShop
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <header className="mb-16">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">Discover Products</h1>
                    <p className="text-gray-400 text-xl">The best digital assets created by top developers.</p>
                </header>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <h3 className="text-2xl font-bold mb-2">No products found.</h3>
                        <p className="text-gray-400">Be the first to create one!</p>
                        <Link href="/dashboard/seller" className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition">
                            Create a Product
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product: any) => (
                            <div key={product.id} className="group flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
                                {/* Image Handle */}
                                <div className="aspect-video w-full bg-black/40 flex items-center justify-center overflow-hidden relative">
                                    {product.previewUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={product.previewUrl}
                                            alt={product.title}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <ImageIcon className="w-10 h-10 text-white/20" />
                                    )}
                                    {/* Category Badge */}
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-white/90 border border-white/10">
                                        {product.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-2 text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                                        {product.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {product.description || "No description provided."}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                                        <span className="text-sm font-medium text-gray-400">By {product.seller?.name || 'Unknown'}</span>
                                        <span className="text-xl font-black text-white">${product.price.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Hover CTA overlays entire card */}
                                <Link href={`/products/${product.id}`} className="absolute inset-0 z-10">
                                    <span className="sr-only">View {product.title}</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
