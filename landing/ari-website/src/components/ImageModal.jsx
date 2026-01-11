import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

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
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
                onClick={onClose}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-20"
                >
                    <X size={32} />
                </button>

                {/* Navigation - Left (Desktop) */}
                {hasPrev && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-20 hidden sm:block"
                    >
                        <ChevronLeft size={48} />
                    </button>
                )}

                {/* Navigation - Right (Desktop) */}
                {hasNext && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2 z-20 hidden sm:block"
                    >
                        <ChevronRight size={48} />
                    </button>
                )}

                {/* Content Container */}
                <div
                    className="relative w-full h-full max-w-7xl flex flex-col sm:justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Image Area */}
                    <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0">
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={4}
                            centerOnInit={true}
                            wheel={{ disabled: true }} // Mouse wheel for zoom can conflict with scrolling if not careful, keeping generic pinch/dblclick
                        >
                            <TransformComponent wrapperClass="!w-full !h-full flex items-center justify-center">
                                <motion.img
                                    key={image.src}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    src={image.src}
                                    alt={image.alt}
                                    className="max-h-[70vh] sm:max-h-[85vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>

                    {/* Caption Area - Responsive */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 sm:absolute sm:bottom-8 sm:left-8 sm:mt-0 max-w-md w-full sm:w-auto z-20"
                    >
                        {/* "Dark Glass" panel */}
                        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
                                    <p className="text-white/80 text-sm leading-relaxed">{image.description}</p>
                                </div>

                                {/* Mobile Nav Controls (Since arrows are hidden on mobile) */}
                                <div className="flex sm:hidden gap-4 items-center shrink-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); hasPrev && onPrev(); }}
                                        disabled={!hasPrev}
                                        className={`p-2 rounded-full bg-white/10 ${hasPrev ? 'text-white' : 'text-white/30'}`}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); hasNext && onNext(); }}
                                        disabled={!hasNext}
                                        className={`p-2 rounded-full bg-white/10 ${hasNext ? 'text-white' : 'text-white/30'}`}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </motion.div>
        </AnimatePresence>
    );
};

export default ImageModal;
