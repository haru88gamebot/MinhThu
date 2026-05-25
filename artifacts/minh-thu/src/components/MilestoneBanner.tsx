import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Sparkles, Star } from "lucide-react";

const LOVE_START = new Date("2026-03-26T00:00:00");

function getMilestone() {
  const now = new Date();
  const days = Math.floor((+now - +LOVE_START) / (1000 * 60 * 60 * 24));
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (days === 100) return {
    emoji: "💯",
    title: "100 Ngày Yêu Nhau!",
    message: "Thư & Vũ đã bên nhau được tròn 100 ngày rồi 🥹 Chúc hai đứa mãi yêu thương, mãi là của nhau nhé! 💕",
    color: "from-rose-400 via-pink-400 to-primary",
    type: "love",
  };
  if (days === 200) return {
    emoji: "🌹",
    title: "200 Ngày Yêu Nhau!",
    message: "200 ngày rồi đó — mỗi ngày có nhau đều là món quà. Mãi yêu anh/em nhé! 💞",
    color: "from-rose-500 via-pink-500 to-purple-400",
    type: "love",
  };
  if (days === 365) return {
    emoji: "🎂",
    title: "Tròn 1 Năm Yêu Nhau!",
    message: "Một năm bên nhau — 365 ngày đong đầy yêu thương. Chúc Thư & Vũ mãi mãi hạnh phúc bên nhau! 💍💕",
    color: "from-yellow-400 via-rose-400 to-primary",
    type: "love",
  };
  if (month === 12 && day === 31) return {
    emoji: "🎆",
    title: "Năm Cũ Sắp Qua!",
    message: "Một năm sắp khép lại — cảm ơn vì đã nỗ lực, cảm ơn vì đã yêu thương. Năm mới sẽ còn tuyệt vời hơn! ✨",
    color: "from-purple-500 via-blue-400 to-cyan-400",
    type: "newyear",
  };
  if (month === 1 && day === 1) return {
    emoji: "🎊",
    title: "Chúc Mừng Năm Mới!",
    message: "Năm mới đến rồi! Chúc Minh Thư luôn xinh đẹp, mạnh khoẻ, học giỏi và mãi hạnh phúc bên người thương 🩷🎉",
    color: "from-yellow-400 via-rose-400 to-purple-500",
    type: "newyear",
  };
  return null;
}

export function MilestoneBanner() {
  const milestone = getMilestone();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (milestone && !dismissed) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [milestone, dismissed]);

  if (!milestone) return null;

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDismissed(true)}
          />

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative w-full max-w-sm z-10"
          >
            <div className={`rounded-[2.5rem] overflow-hidden shadow-2xl bg-gradient-to-br ${milestone.color} p-1`}>
              <div className="bg-background rounded-[2.2rem] px-7 py-8 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${milestone.color} opacity-10`} />

                <button
                  onClick={() => setDismissed(true)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    className="text-7xl mb-4 inline-block"
                  >
                    {milestone.emoji}
                  </motion.div>

                  <h2 className="text-2xl font-serif font-bold mb-3">{milestone.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{milestone.message}</p>

                  <div className="flex justify-center gap-2 mb-6">
                    {(milestone.type === "love" ? [Heart, Heart, Heart] : [Star, Sparkles, Star]).map((Icon, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        <Icon className="w-5 h-5 text-primary" fill="currentColor" />
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={() => setDismissed(true)}
                    className={`w-full py-3 rounded-2xl bg-gradient-to-r ${milestone.color} text-white font-bold shadow-lg hover:-translate-y-0.5 transition-transform`}
                  >
                    Yêu lắm! 🩷
                  </button>
                </div>
              </div>
            </div>

            {/* Confetti-like floating dots */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ["#f43f5e","#ec4899","#a855f7","#3b82f6","#fbbf24","#34d399"][i % 6],
                  top: `${10 + Math.random() * 80}%`,
                  left: `${5 + Math.random() * 90}%`,
                }}
                animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
