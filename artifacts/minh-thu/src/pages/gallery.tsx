import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images, BadgeCheck } from "lucide-react";
import { Link } from "wouter";

const TOTAL = 68;
const photos = Array.from({ length: TOTAL }, (_, i) => i + 1);

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox((n) => (n && n > 1 ? n - 1 : TOTAL));
  const next = () => setLightbox((n) => (n && n < TOTAL ? n + 1 : 1));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/30 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-bold text-primary flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          Minh Thư <BadgeCheck className="w-5 h-5 text-blue-500" fill="currentColor" stroke="white" />
        </Link>
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <Images className="w-4 h-4" />
          <span>Gallery — {TOTAL} ảnh</span>
        </div>
        <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Trang chủ
        </Link>
      </nav>

      {/* Hero text */}
      <div className="text-center py-12 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-serif font-bold mb-3"
        >
          Bộ sưu tập ảnh
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-muted-foreground text-lg"
        >
          Những khoảnh khắc đáng nhớ của Thư 🩷
        </motion.p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <motion.div
          className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 space-y-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
        >
          {photos.map((num) => (
            <motion.div
              key={num}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
              }}
              className="break-inside-avoid mb-3 cursor-pointer group"
              onClick={() => setLightbox(num)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-md ring-0 group-hover:ring-2 group-hover:ring-primary transition-all duration-300">
                <img
                  src={`/gallery/photo_${num}.jpg`}
                  alt={`Ảnh ${num}`}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {num}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-h-[85vh] max-w-[85vw] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`/gallery/photo_${lightbox}.jpg`}
                alt={`Ảnh ${lightbox}`}
                className="max-h-[85vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl"
              />
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                {lightbox} / {TOTAL}
              </span>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
