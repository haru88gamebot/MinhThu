import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const REASONS = [
  { number: "01", front: "✨", back: "Vì nụ cười của Thư làm sáng cả một ngày tối tăm nhất của anh." },
  { number: "02", front: "🥺", back: "Vì cái cách Thư nhìn anh — như thể anh là thứ quan trọng nhất thế giới." },
  { number: "03", front: "🌸", back: "Vì Thư dũng cảm yêu trước — điều đó làm anh nể phục và cảm động mãi." },
  { number: "04", front: "💌", back: "Vì những tin nhắn nhỏ của Thư luôn đến đúng lúc anh cần nhất." },
  { number: "05", front: "🤍", back: "Vì Thư chân thành — không giả tạo, không màu mè, chỉ là Thư thôi." },
  { number: "06", front: "🌙", back: "Vì những đêm nói chuyện muộn với Thư là ký ức anh không muốn quên." },
  { number: "07", front: "🦋", back: "Vì Thư kiên trì — dù bị từ chối, Thư vẫn ở đó. Điều đó thay đổi tất cả." },
  { number: "08", front: "🩷", back: "Vì khi ở bên Thư, anh thấy bình yên theo một cách rất khó giải thích." },
  { number: "09", front: "🌿", back: "Vì Thư nhỏ bé nhưng mạnh mẽ hơn anh nghĩ rất nhiều." },
  { number: "10", front: "💫", back: "Vì Thư làm anh muốn trở nên tốt hơn mỗi ngày." },
  { number: "11", front: "🎀", back: "Vì cái cách Thư hay sân si — buồn cười lắm nhưng anh thấy thương vô cùng." },
  { number: "12", front: "💕", back: "Vì trong tất cả mọi người, anh chọn Thư — và anh sẽ không hối hận điều đó." },
];

function FlipCard({ reason, index }: { reason: typeof REASONS[0]; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="aspect-square cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}
        className="relative"
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2 select-none"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-50 via-pink-50 to-primary/10 border border-rose-200/60 shadow-sm group-hover:shadow-md" />
          <span className="relative text-[10px] font-bold text-primary/50 tracking-widest">{reason.number}</span>
          <span className="relative text-4xl leading-none">{reason.front}</span>
          <span className="relative text-[10px] text-muted-foreground/60 mt-1">bấm để xem 💕</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center p-4 select-none"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/90 to-rose-500/80 shadow-lg shadow-primary/25" />
          <div className="absolute top-2.5 left-3 text-[10px] font-bold text-white/50 tracking-widest">{reason.number}</div>
          <p className="relative text-center text-white text-[11px] sm:text-xs leading-relaxed font-medium">
            {reason.back}
          </p>
          <Heart className="absolute bottom-2.5 right-3 w-3 h-3 text-white/40" fill="currentColor" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function LyDoYeu() {
  const [revealAll, setRevealAll] = useState(false);
  const [allFlipped, setAllFlipped] = useState(false);

  const handleRevealAll = () => {
    setRevealAll(true);
    setAllFlipped(true);
  };

  return (
    <section id="lydoyeu" className="py-32 px-6 md:px-12 relative z-10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-rose-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">Dành cho Thư</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            12 Lý Do Anh Yêu Thư
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Bấm vào từng thẻ để khám phá — mỗi lý do là một điều anh nghĩ về em mỗi ngày 🩷
          </p>
        </motion.div>

        {/* Cards grid */}
        {!revealAll ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
            {REASONS.map((r, i) => (
              <FlipCard key={r.number} reason={r} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4"
          >
            {REASONS.map((r, i) => (
              <motion.div
                key={r.number}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                className="aspect-square rounded-2xl bg-gradient-to-br from-primary/90 to-rose-500/80 shadow-lg shadow-primary/20 flex items-center justify-center p-4 relative overflow-hidden"
              >
                <div className="absolute top-2 left-3 text-[10px] font-bold text-white/40 tracking-widest">{r.number}</div>
                <p className="text-center text-white text-[10px] sm:text-xs leading-relaxed font-medium">{r.back}</p>
                <Heart className="absolute bottom-2 right-3 w-3 h-3 text-white/30" fill="currentColor" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Reveal all button */}
        {!revealAll && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-10"
          >
            <motion.button
              onClick={handleRevealAll}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-rose-400 text-white font-bold shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-shadow"
            >
              <Heart className="w-4 h-4" fill="currentColor" />
              Xem tất cả lý do
              <Heart className="w-4 h-4" fill="currentColor" />
            </motion.button>
            <p className="text-xs text-muted-foreground mt-3">Hoặc bấm từng thẻ để khám phá dần dần 🌸</p>
          </motion.div>
        )}

        {/* Reset */}
        {revealAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => { setRevealAll(false); setAllFlipped(false); }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              Lật lại từ đầu
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
