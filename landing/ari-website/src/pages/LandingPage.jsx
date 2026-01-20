import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionBackground from '../components/ConnectionBackground';
import ImageModal from '../components/ImageModal';
import Footer from '../components/Footer';
import { Menu, X, ExternalLink, Shield, History, Users, Heart, AlertTriangle, Globe } from 'lucide-react';

function LandingPage() {
    const { t, i18n } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsLangMenuOpen(false);
        setIsMenuOpen(false);
    };

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ru', label: 'Русский' },
        { code: 'lv', label: 'Latviešu' },
    ];

    // Define screenshots data for the modal gallery
    const screenshots = [
        {
            src: "/assets/ari_dashboard_4.png",
            alt: "Ari Dashboard",
            title: t('screenshots.dashboard.title'),
            description: t('screenshots.dashboard.text')
        },
        {
            src: "/assets/ari_contact_4.png",
            alt: "Contact Details",
            title: t('screenshots.contacts.title'),
            description: t('screenshots.contacts.text')
        },
        {
            src: "/assets/ari_filtering_search_4.png",
            alt: "Search",
            title: t('screenshots.search'),
            description: t('screenshots.search')
        },
        {
            src: "/assets/ari_history_4.png",
            alt: "History",
            title: t('screenshots.history'),
            description: t('screenshots.history')
        }
    ];

    const openModal = (index) => {
        setSelectedImageIndex(index);
    };

    const closeModal = () => {
        setSelectedImageIndex(null);
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % screenshots.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    };

    return (
        <div className="relative min-h-screen text-gray-800 font-sans">
            <ConnectionBackground />

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <img src="/assets/ari_logo_3-removebg.png" alt="Ari Logo" className="h-10 w-auto" />
                            <span className="font-bold text-2xl tracking-tight text-slate-900">Ari</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">{t('nav.features')}</a>
                            <a href="#screenshots" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">{t('nav.screenshots')}</a>
                            <a href="https://docs.personal-ari.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">{t('nav.docs')}</a>
                            <a href="https://github.com/aleksejs1/ari" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-violet-600 font-medium transition-colors flex items-center gap-1">
                                {t('nav.github')} <ExternalLink size={16} />
                            </a>

                            {/* Language Switcher (Desktop) */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                    className="flex items-center gap-1 text-gray-600 hover:text-violet-600 font-medium transition-colors"
                                >
                                    <Globe size={18} />
                                    <span className="uppercase">{i18n.language.split('-')[0]}</span>
                                </button>
                                {isLangMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-violet-50 hover:text-violet-700 ${i18n.language.startsWith(lang.code) ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-gray-700'}`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <a href="https://app.personal-ari.com/" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                {t('nav.demo')}
                            </a>
                        </div>

                        <div className="md:hidden flex items-center gap-4">
                            {/* Language Switcher (Mobile) */}
                            <button
                                onClick={() => changeLanguage(i18n.language.startsWith('en') ? 'ru' : (i18n.language.startsWith('ru') ? 'lv' : 'en'))}
                                className="flex items-center gap-1 text-gray-600 font-medium"
                            >
                                <Globe size={20} />
                                <span className="uppercase">{i18n.language.split('-')[0]}</span>
                            </button>

                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-gray-900 p-2">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-100">
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            <a href="#features" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-violet-600 hover:bg-gray-50 rounded-md">{t('nav.features')}</a>
                            <a href="#screenshots" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-violet-600 hover:bg-gray-50 rounded-md">{t('nav.screenshots')}</a>
                            <a href="https://docs.personal-ari.com/" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-violet-600 hover:bg-gray-50 rounded-md">{t('nav.docs')}</a>
                            <a href="https://github.com/aleksejs1/ari" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-violet-600 hover:bg-gray-50 rounded-md">{t('nav.github')}</a>
                            <a href="https://app.personal-ari.com/" className="block w-full text-center mt-4 px-3 py-3 bg-violet-600 text-white font-bold rounded-lg shadow-md">{t('nav.demo')}</a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold mb-6 animate-fade-in-up">
                        <span className="w-2 h-2 bg-violet-500 rounded-full mr-2"></span>
                        {t('hero.status')}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
                        {t('hero.title_start')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">
                            {t('hero.title_highlight')}
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t('hero.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="https://app.personal-ari.com/" className="px-8 py-4 bg-violet-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-violet-500/30 hover:bg-violet-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                            <Users className="w-5 h-5" />
                            {t('hero.launch_demo')}
                        </a>
                        <a href="https://github.com/aleksejs1/ari" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                            <ExternalLink className="w-5 h-5" />
                            {t('hero.view_source')}
                        </a>
                    </div>
                </div>
            </section>

            {/* Warning/Info Banner */}
            <div className="bg-amber-50 border-y border-amber-100">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-start gap-4">
                    <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900">
                        <strong className="font-semibold block mb-1">{t('warning.title')}</strong>
                        {t('warning.text')}
                    </div>
                </div>
            </div>

            {/* Meet Ari Section */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">{t('meet_ari.title')}</h2>
                            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
                                <span className="text-slate-900 font-medium">{t('meet_ari.subtitle_highlight')}</span> {t('meet_ari.text')}
                            </p>
                        </div>
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-violet-100/50 to-purple-50/50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
                            <img
                                src="/assets/ari_working.png"
                                alt="Ari working"
                                className="w-full h-auto rounded-3xl shadow-xl border border-slate-100 transform -rotate-2 hover:rotate-0 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* What Ari Actually Does Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{t('feature_detail.title')}</h2>
                    </div>

                    <div className="space-y-32">
                        {/* Feature 1: Remembers */}
                        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                            <div className="flex-1 w-full relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-cyan-50 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-1000"></div>
                                <img
                                    src="/assets/ari_table.png"
                                    alt="Ari Table"
                                    className="w-full rounded-2xl shadow-lg border border-slate-200 relative bg-white transform group-hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">{t('feature_detail.remembers.title')}</h3>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {t('feature_detail.remembers.text')}
                                </p>
                            </div>
                        </div>

                        {/* Feature 2: Context (Reversed) */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
                            <div className="flex-1 w-full relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-violet-100 to-fuchsia-50 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-1000"></div>
                                <img
                                    src="/assets/ari_phone.png"
                                    alt="Ari Phone"
                                    className="w-2/3 mx-auto md:w-full max-w-sm md:max-w-none rounded-[2.5rem] shadow-xl border-4 border-slate-900 relative bg-slate-900 transform group-hover:rotate-1 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">{t('feature_detail.context.title')}</h3>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {t('feature_detail.context.text')}
                                </p>
                            </div>
                        </div>

                        {/* Feature 3: Helps you show up */}
                        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                            <div className="flex-1 w-full relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-teal-50 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-1000"></div>
                                <img
                                    src="/assets/ari_flowers_help.png"
                                    alt="Ari Help"
                                    className="w-full rounded-2xl shadow-lg border border-slate-200 relative bg-white transform group-hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">{t('feature_detail.show_up.title')}</h3>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {t('feature_detail.show_up.text')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">{t('features.title')}</h2>
                        <p className="mt-4 text-lg text-gray-600">{t('features.subtitle')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                <History className="text-blue-600 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{t('features.history.title')}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t('features.history.text')}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="text-violet-600 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{t('features.ownership.title')}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t('features.ownership.text')}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-6">
                                <Heart className="text-pink-600 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{t('features.notifications.title')}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {t('features.notifications.text')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Screenshot Showcase */}
            <section id="screenshots" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">{t('screenshots.title')}</h2>

                    <div className="space-y-20">
                        {/* Feature 1 - Dashboard - Index 0 */}
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="flex-1 space-y-6">
                                <h3 className="text-2xl font-bold text-slate-900">{t('screenshots.dashboard.title')}</h3>
                                <p className="text-lg text-gray-600">
                                    {t('screenshots.dashboard.text')}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                                        {t('screenshots.dashboard.list1')}
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                                        {t('screenshots.dashboard.list2')}
                                    </li>
                                </ul>
                            </div>
                            <div
                                className="flex-1 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white cursor-zoom-in hover:opacity-95 transition-opacity"
                                onClick={() => openModal(0)}
                            >
                                <img src="/assets/ari_dashboard_4.png" alt="Ari Dashboard" className="w-full h-auto" />
                            </div>
                        </div>

                        {/* Feature 2 (Reverse) - Contacts - Index 1 */}
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                            <div className="flex-1 space-y-6">
                                <h3 className="text-2xl font-bold text-slate-900">{t('screenshots.contacts.title')}</h3>
                                <p className="text-lg text-gray-600">
                                    {t('screenshots.contacts.text')}
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                                        {t('screenshots.contacts.list1')}
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                                        {t('screenshots.contacts.list2')}
                                    </li>
                                </ul>
                            </div>
                            <div
                                className="flex-1 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white cursor-zoom-in hover:opacity-95 transition-opacity"
                                onClick={() => openModal(1)}
                            >
                                <img src="/assets/ari_contact_4.png" alt="Contact Details" className="w-full h-auto" />
                            </div>
                        </div>

                        {/* Grid for others */}
                        <div className="grid md:grid-cols-2 gap-8 mt-12">
                            {/* Search - Index 2 */}
                            <div
                                className="rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white group cursor-zoom-in"
                                onClick={() => openModal(2)}
                            >
                                <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">{t('screenshots.search')}</div>
                                <img src="/assets/ari_filtering_search_4.png" alt="Search" className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            {/* History - Index 3 */}
                            <div
                                className="rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white group cursor-zoom-in"
                                onClick={() => openModal(3)}
                            >
                                <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">{t('screenshots.history')}</div>
                                <img src="/assets/ari_history_4.png" alt="History" className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Image Modal for Fullscreen View */}
            <ImageModal
                isOpen={selectedImageIndex !== null}
                image={selectedImageIndex !== null ? screenshots[selectedImageIndex] : null}
                onClose={closeModal}
                onNext={nextImage}
                onPrev={prevImage}
                hasNext={true} // Carousel logic for now
                hasPrev={true}
            />
        </div >
    );
}

export default LandingPage;
