import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const TermsPage = () => {
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
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Terms of Service</h1>

                    <div className="prose prose-slate max-w-none text-gray-600">
                        <p className="lead text-xl text-gray-700 mb-6">
                            By using Ari, you agree to the following terms.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Project status</h2>
                        <p className="mb-4">Ari is an actively developed, experimental project.</p>
                        <p className="mb-4">Features, data models, and behavior may change at any time.</p>
                        <p className="mb-6 font-semibold">The public instance is provided as-is, without guarantees of availability, stability, or data persistence.</p>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">No warranties</h2>
                        <p className="mb-4">Ari is provided without any warranties, express or implied.</p>
                        <p className="mb-6">We do not guarantee uptime, data integrity, or suitability for any particular purpose.</p>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Data responsibility</h2>
                        <p className="mb-4">You are responsible for the data you store in Ari.</p>
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                            <p className="text-amber-900 mb-2">Please do not use the public instance for sensitive, personal, or critical data.</p>
                            <p className="text-amber-900">Data loss may occur during development, testing, or maintenance.</p>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Account termination</h2>
                        <p className="mb-4">Accounts and associated data may be removed:</p>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li>at your request</li>
                            <li>due to abuse or misuse</li>
                            <li>as part of maintenance or development work</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Self-hosting</h2>
                        <p className="mb-6">
                            When self-hosting Ari, you assume full responsibility for deployment, security, backups, and data protection.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Limitation of liability</h2>
                        <p className="mb-6">
                            To the maximum extent permitted by law, the author is not liable for any damages or losses resulting from the use of Ari.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Changes</h2>
                        <p className="mb-4">These terms may change as the project evolves.</p>
                        <p className="mb-6">Continued use of Ari implies acceptance of updated terms.</p>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsPage;
