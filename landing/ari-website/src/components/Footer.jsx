import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-3 mb-6 md:mb-0">
                        <span className="font-bold text-2xl text-white">Ari</span>
                        <span className="text-sm bg-slate-800 px-2 py-1 rounded text-slate-400">v0.1.0-beta</span>
                    </div>

                    <div className="text-sm text-center md:text-right">
                        <p>{t('footer.rights')}</p>
                        <p className="mt-2 flex items-center justify-center md:justify-end gap-2">
                            <a href="https://github.com/aleksejs1/ari" className="hover:text-white transition-colors">{t('nav.github')}</a>
                            <span className="mx-2">·</span>
                            <a href="https://docs.personal-ari.com/" className="hover:text-white transition-colors">{t('nav.docs')}</a>
                            <span className="mx-2">·</span>
                            <a href="http://personal-ari.com" className="hover:text-white transition-colors">{t('footer.website')}</a>
                            <span className="mx-2">·</span>
                            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <span className="mx-2">·</span>
                            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
