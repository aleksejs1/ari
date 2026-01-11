import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageModal = ({ isOpen, image, onClose, onNext, onPrev, hasNext, hasPrev }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && hasNext) onNext();
            if (e.key === 'ArrowLeft' && hasPrev) onPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

    if (!isOpen || !image) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-10"
                >
                    <X size={32} />
                </button>

                {/* Navigation - Left */}
                {hasPrev && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-10 hidden sm:block"
                    >
                        <ChevronLeft size={48} />
                    </button>
                )}

                {/* Image Container */}
                <div
                    className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center justify-center pointer-events-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.img
                        key={image.src}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        src={image.src}
                        alt={image.alt}
                        className="max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl pointer-events-auto"
                    />

                    {/* Floating Caption */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 pointer-events-auto max-w-md"
                    >
                        {/* "Glass" panel with dark background for readability on any image */}
                        <div className="bg-slate-900/75 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
                            <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
                            <p className="text-white/80 text-sm leading-relaxed">{image.description}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Navigation - Right */}
                {hasNext && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-10 hidden sm:block"
                    >
                        <ChevronRight size={48} />
                    </button>
                )}

            </motion.div>
        </AnimatePresence>
    );
};

export default ImageModal;
