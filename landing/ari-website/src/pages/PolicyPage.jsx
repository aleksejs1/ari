import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const PolicyPage = () => {
    return (
        <div className="relative min-h-screen text-gray-800 font-sans flex flex-col">
            {/* Simple Header */}
            <nav className="bg-white border-b border-gray-100 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/assets/ari_logo_3-removebg.png" alt="Ari Logo" className="h-10 w-auto" />
                        <span className="font-bold text-2xl tracking-tight text-slate-900">Ari</span>
                    </Link>
                    <Link to="/" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">
                        Back to Home
                    </Link>
                </div>
            </nav>

            <main className="flex-grow py-16 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Privacy Policy</h1>

                    <div className="prose prose-slate max-w-none text-gray-600">
                        <p className="lead text-xl text-gray-700 mb-6">
                            Ari is built with privacy as a core principle.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">What data we collect</h2>
                        <p className="mb-4">We only collect the data required for the system to function:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>account information (email, authentication data)</li>
                            <li>contacts and related metadata you choose to store</li>
                            <li>notification configuration and delivery logs</li>
                            <li>basic technical logs for debugging and system stability</li>
                        </ul>
                        <p className="mb-6 font-semibold">We do not collect analytics, tracking data, or behavioral profiles.</p>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">How your data is used</h2>
                        <p className="mb-4">Your data is used only to provide the functionality of Ari:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>storing and managing your contacts</li>
                            <li>delivering notifications</li>
                            <li>ensuring system reliability and security</li>
                        </ul>
                        <p className="mb-6">Your data is <span className="font-bold">never sold, shared with third parties, or used for advertising.</span></p>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Public instance disclaimer</h2>
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                            <p className="font-semibold text-amber-800">The public instance is provided for evaluation and demo purposes only.</p>
                            <ul className="list-disc pl-5 mt-2 text-amber-900 space-y-1">
                                <li>Active development is ongoing</li>
                                <li>Data migrations are not guaranteed</li>
                                <li>Data loss may occur</li>
                            </ul>
                            <p className="mt-2 text-amber-900 font-medium">Please do not use the public instance for sensitive or irreplaceable data.</p>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Self-hosting</h2>
                        <p className="mb-6">
                            Ari is open source and designed to be self-hosted.
                            When you run your own instance, you fully control your data.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Data deletion</h2>
                        <p className="mb-6">
                            You can permanently delete your account and all associated data from the system.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Changes</h2>
                        <p className="mb-6">
                            This policy may change as the project evolves. Any updates will be published transparently.
                        </p>

                        <div className="mt-12 pt-6 border-t border-gray-100">
                            <p>If you have questions or concerns, please open an issue or discussion in the <a href="https://github.com/aleksejs1/ari" className="text-violet-600 hover:underline">repository</a>.</p>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PolicyPage;
