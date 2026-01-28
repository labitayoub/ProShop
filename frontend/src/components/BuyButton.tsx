/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function BuyButton({ productId }: { productId: string }) {
    const { user } = useUser();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleBuy = async () => {
        if (!user) {
            window.location.href = "/api/auth/login";
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch(`/api/orders/buy/${productId}`, {
                method: 'POST',
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to purchase');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard/purchases');
            }, 1500);
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {errorMsg && (
                <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    {errorMsg}
                </div>
            )}
            <button
                onClick={handleBuy}
                disabled={loading || success}
                className="w-full group relative overflow-hidden rounded-2xl p-[2px] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-80 disabled:hover:scale-100"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl opacity-100 group-hover:opacity-80 transition-opacity" />
                <div className="relative bg-[#0A0A0B] backdrop-blur-sm rounded-[14px] py-4 px-6 flex items-center justify-center font-bold text-lg text-white group-hover:bg-black/50 transition-colors cursor-pointer">
                    {loading ? (
                        <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Processing...</>
                    ) : success ? (
                        <><CheckCircle2 className="w-5 h-5 mr-3 text-emerald-400" /> Redirecting...</>
                    ) : (
                        <><ShoppingCart className="w-5 h-5 mr-3" /> Buy Now</>
                    )}
                </div>
            </button>
        </div>
    );
}
