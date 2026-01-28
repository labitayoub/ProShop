/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { UploadCloud, CheckCircle2, ArrowRight, Loader2, DollarSign, Package } from 'lucide-react';

export default function SellerDashboard() {
    const { user, isLoading: authLoading } = useUser();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');
        setSuccess(false);

        try {
            const formData = new FormData(e.currentTarget);

            const res = await fetch('/api/products', {
                method: 'POST',
                body: formData, // the browser automatically sets Content-Type to multipart/form-data
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to upload product');
            }

            setSuccess(true);
            // Reset form on success
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white"><Loader2 className="animate-spin w-8 h-8" /></div>;
    if (!user) {
        if (typeof window !== 'undefined') window.location.href = "/api/auth/login";
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-purple-500/30 font-sans relative overflow-hidden">
            {/* Dynamic Background Blurs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 py-20 relative z-10 w-full">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent mb-4">
                        Create Product
                    </h1>
                    <p className="text-gray-400 text-lg">Sell your digital assets, securely. Fill out the details below.</p>
                </header>

                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/20">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Product Title</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                    <input required name="title" type="text" placeholder="e.g. Masterclass Pro" className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea required name="description" rows={4} placeholder="What makes this product special..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Price (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                        <input required name="price" type="number" step="0.01" min="0" placeholder="0.00" className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select required name="category" className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer">
                                        <option value="" disabled selected>Select...</option>
                                        <option value="eBook">eBook</option>
                                        <option value="Software">Software</option>
                                        <option value="Video Course">Video Course</option>
                                        <option value="Audio">Audio</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Image Upload Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image (Preview)</label>
                                <div className="relative group w-full h-32 rounded-2xl border-2 border-dashed border-white/10 bg-black/20 hover:bg-black/40 hover:border-purple-500/50 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                                    <input required name="previewImage" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-purple-400 transition-colors mb-2" />
                                    <p className="text-sm text-gray-400 group-hover:text-white transition-colors">Click to upload image</p>
                                </div>
                            </div>

                            {/* Digital File Upload Area */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Digital File (The Asset)</label>
                                <div className="relative group w-full h-32 rounded-2xl border-2 border-dashed border-white/10 bg-black/20 hover:bg-black/40 hover:border-blue-500/50 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                                    <input required name="digitalFile" type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-400 transition-colors mb-2" />
                                    <p className="text-sm text-gray-400 group-hover:text-white transition-colors">Upload actual file (.zip, .pdf)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Messages */}
                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center">
                            Erreur: {errorMsg}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center">
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Success! Your product has been listed.
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full relative group overflow-hidden rounded-2xl p-[2px] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-black/50 backdrop-blur-sm rounded-[14px] py-4 px-6 flex items-center justify-center font-semibold tracking-wide text-white">
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Uploading securely...</>
                            ) : (
                                <>Publish Product <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
}
