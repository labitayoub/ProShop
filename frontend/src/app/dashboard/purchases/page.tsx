/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAccessToken, getSession } from '@auth0/nextjs-auth0';
import { Download, ShoppingBag, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getPurchases() {
    const tokenResult = await getAccessToken();
    const accessToken = tokenResult?.accessToken;

    if (!accessToken) {
        return null; // Will trigger redirect
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders/purchases`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: 'no-store'
        });

        if (!res.ok) throw new Error('Failed to fetch orders');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function PurchasesDashboard() {
    const session = await getSession();
    if (!session?.user) {
        redirect('/api/auth/login');
    }

    const orders = await getPurchases();

    if (!orders) {
        redirect('/api/auth/login');
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-purple-500/30 overflow-hidden relative">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Nav */}
            <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
                <Link href="/shop" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Shop
                </Link>
                <span className="text-gray-500 font-medium flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-500" /> My Purchases
                </span>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">My Library</h1>
                    <p className="text-gray-400 text-lg">Download and access the digital products you own.</p>
                </header>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <h3 className="text-2xl font-bold mb-2">Your library is empty.</h3>
                        <p className="text-gray-400">You haven't purchased any digital assets yet.</p>
                        <Link href="/shop" className="inline-block mt-6 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition">
                            Explore Store
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {orders.map((order: any) => {
                            // We pick the first item of the order (in our logic, an order has 1 item)
                            const item = order.items[0];
                            if (!item) return null;
                            const product = item.product;

                            return (
                                <div key={order.id} className="flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                                    {/* Image Handle */}
                                    <div className="aspect-video w-full bg-black/40 flex items-center justify-center overflow-hidden relative">
                                        {product.previewUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={product.previewUrl}
                                                alt={product.title}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <ImageIcon className="w-10 h-10 text-white/20" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-2 text-white line-clamp-1">{product.title}</h3>
                                        <p className="text-sm text-gray-500 mb-6">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>

                                        <div className="mt-auto">
                                            {/* Direct download proxy endpoint */}
                                            <a href={`/api/orders/download/${product.id}`} className="w-full flex items-center justify-center px-6 py-3 bg-purple-600/20 text-purple-400 border border-purple-500/30 font-semibold rounded-2xl hover:bg-purple-600/30 transition-colors gap-2">
                                                <Download className="w-5 h-5" /> Download Asset
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
