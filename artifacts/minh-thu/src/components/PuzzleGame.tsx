import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Trophy, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

const COLS = 4;
const ROWS = 3;
const TOTAL = COLS * ROWS; // 12 pieces

const PHOTOS = [
  "/gallery/photo_2.jpg",
  "/gallery/photo_5.jpg",
  "/gallery/photo_10.jpg",
  "/gallery/photo_15.jpg",
  "/gallery/photo_20.jpg",
];

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Make sure it's not already solved
  if (a.every((v, i) => v === i)) return shuffle(arr);
  return a;
}

export function PuzzleGame() {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [pieces, setPieces] = useState<number[]>(() => shuffle(Array.from({ length: TOTAL }, (_, i) => i)));
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUsed, setPreviewUsed] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const photo = PHOTOS[photoIdx];

  const checkSolved = useCallback((arr: number[]) => arr.every((v, i) => v === i), []);

  const reset = () => {
    setPieces(shuffle(Array.from({ length: TOTAL }, (_, i) => i)));
    setSelected(null);
    setMoves(0);
    setSolved(false);
    setCelebrating(false);
  };

  const changePhoto = (dir: number) => {
    setPhotoIdx(i => (i + dir + PHOTOS.length) % PHOTOS.length);
    reset();
  };

  const handleClick = (idx: number) => {
    if (solved) return;
    if (selected === null) {
      setSelected(idx);
    } else if (selected === idx) {
      setSelected(null);
    } else {
      const next = [...pieces];
      [next[selected], next[idx]] = [next[idx], next[selected]];
      setPieces(next);
      setSelected(null);
      setMoves(m => m + 1);
      if (checkSolved(next)) {
        setSolved(true);
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 3500);
      }
    }
  };

  // Piece component - shows correct slice of the photo
  const Piece = ({ pieceValue, slotIdx }: { pieceValue: number; slotIdx: number }) => {
    const col = pieceValue % COLS;
    const row = Math.floor(pieceValue / COLS);
    const isSelected = selected === slotIdx;
    const isCorrect = solved || pieceValue === slotIdx;

    return (
      <motion.button
        onClick={() => handleClick(slotIdx)}
        whileHover={!solved ? { scale: 1.03 } : {}}
        whileTap={!solved ? { scale: 0.96 } : {}}
        animate={isSelected ? { scale: 1.06, zIndex: 10 } : { scale: 1, zIndex: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`relative overflow-hidden rounded-lg transition-all ${
          isSelected
            ? "ring-4 ring-primary ring-offset-1 shadow-xl shadow-primary/30"
            : solved
            ? "ring-1 ring-green-400/40"
            : "ring-1 ring-border/60 hover:ring-primary/40 cursor-pointer"
        }`}
        style={{ aspectRatio: `${COLS}/${ROWS}` }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${photo})`,
            backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
            backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
            backgroundRepeat: "no-repeat",
            filter: solved ? "none" : isSelected ? "brightness(1.1) saturate(1.2)" : "none",
          }}
        />
        {/* Piece number hint (faint) */}
        {!solved && (
          <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-white/40 select-none">
            {slotIdx + 1}
          </span>
        )}
        {/* Correct indicator */}
        {!solved && pieceValue === slotIdx && (
          <div className="absolute inset-0 bg-green-400/10 pointer-events-none" />
        )}
      </motion.button>
    );
  };

  return (
    <section id="puzzle" className="py-32 px-6 md:px-12 relative z-10 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-rose-100/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Mini game</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3">Ghép Ảnh Thư 🧩</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Bấm chọn một mảnh rồi bấm mảnh khác để hoán đổi — ghép đúng hết để xem ảnh đẹp của Thư 🩷
          </p>
        </motion.div>

        {/* Photo selector */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={() => changePhoto(-1)} className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setPhotoIdx(i); reset(); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === photoIdx ? "bg-primary scale-125" : "bg-border hover:bg-primary/50"}`}
              />
            ))}
          </div>
          <button onClick={() => changePhoto(1)} className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Số bước: <strong className="text-foreground">{moves}</strong></span>
            <span className="text-muted-foreground">
              Đúng chỗ: <strong className="text-foreground">{pieces.filter((v, i) => v === i).length}</strong>/{TOTAL}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setShowPreview(true); setPreviewUsed(true); setTimeout(() => setShowPreview(false), 3000); }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/10 border border-border/60"
            >
              👁 Xem gợi ý
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10 border border-border/60"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Trộn lại
            </motion.button>
          </div>
        </div>

        {/* Preview overlay */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm rounded-2xl"
            >
              <img src={photo} className="max-w-xs rounded-2xl shadow-2xl" alt="preview" />
              <p className="absolute bottom-6 text-white/80 text-sm">Xem 3 giây rồi tự làm nhé! 👀</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Puzzle grid */}
        <div className="relative">
          <div
            className={`grid gap-1.5 transition-all duration-300 ${solved ? "pointer-events-none" : ""}`}
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          >
            {pieces.map((pieceValue, slotIdx) => (
              <Piece key={slotIdx} pieceValue={pieceValue} slotIdx={slotIdx} />
            ))}
          </div>

          {/* Win overlay */}
          <AnimatePresence>
            {solved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 rounded-2xl overflow-hidden"
              >
                <img src={photo} className="w-full h-full object-cover rounded-2xl" alt="solved" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-white font-serif font-bold text-xl mb-1">Ghép xong rồi!</p>
                    <p className="text-white/80 text-sm mb-4">
                      {moves} bước{previewUsed ? " (có dùng gợi ý)" : ""} — Thư đẹp lắm nhỉ 🩷
                    </p>
                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors"
                    >
                      <Shuffle className="w-4 h-4" />
                      Chơi lại
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confetti on win */}
        <AnimatePresence>
          {celebrating && (
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-sm"
                  style={{
                    background: ["#f43f5e","#ec4899","#a855f7","#fbbf24","#34d399","#60a5fa"][i % 6],
                    left: `${Math.random() * 100}%`,
                    top: "-10px",
                    rotate: Math.random() * 360,
                  }}
                  animate={{ y: "110vh", rotate: Math.random() * 720, opacity: [1, 1, 0] }}
                  transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 1.5, ease: "easeIn" }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Help text */}
        {!solved && (
          <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-primary/20 border border-primary/50" />
            Mảnh đúng chỗ
            <span className="mx-2">·</span>
            <span className="inline-block w-3 h-3 rounded bg-primary/30 ring-2 ring-primary" />
            Đang chọn
          </p>
        )}
      </div>
    </section>
  );
}
