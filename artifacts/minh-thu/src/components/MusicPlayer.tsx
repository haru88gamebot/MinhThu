import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, VolumeX, Volume2, SkipForward, SkipBack } from "lucide-react";

const TRACKS = [
  { title: "Cố Gắng Thêm 💪", url: "/music/tt1-co-gang.mp3" },
  { title: "Động Lực 🍀", url: "/music/tt2-dong-luc.mp3" },
  { title: "Study Now 📚", url: "/music/tt3-study-now.mp3" },
  { title: "Niềm Tin 🦋", url: "/music/tt4-niem-tin.mp3" },
  { title: "An Nhiên 🌸", url: "/music/tt5-an-nhien.mp3" },
  { title: "Nỗ Lực Học Tập 🎵", url: "/music/no-luc-hoc-tap.mp3" },
];

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(TRACKS[trackIdx].url);
    audio.volume = 0.35;
    audio.addEventListener("ended", () => {
      autoPlayRef.current = true;
      setTrackIdx(prev => (prev + 1) % TRACKS.length);
    });
    audioRef.current = audio;
    if (autoPlayRef.current) {
      autoPlayRef.current = false;
      audio.play().catch(() => {});
      setPlaying(true);
    }
    return () => { audio.pause(); audio.src = ""; };
  }, [trackIdx]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const goTo = (idx: number) => {
    const wasPlaying = playing;
    audioRef.current?.pause();
    setPlaying(false);
    setTrackIdx(idx);
    if (wasPlaying) {
      setTimeout(() => { audioRef.current?.play().catch(() => {}); setPlaying(true); }, 150);
    }
  };

  const prev = () => goTo((trackIdx - 1 + TRACKS.length) % TRACKS.length);
  const next = () => goTo((trackIdx + 1) % TRACKS.length);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-background/95 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl overflow-hidden w-56"
          >
            <div className="px-4 py-2.5 border-b border-border/30">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Danh sách nhạc TikTok</p>
            </div>
            <div className="py-1">
              {TRACKS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                    i === trackIdx ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted/60 text-foreground"
                  }`}
                >
                  {i === trackIdx && playing ? (
                    <span className="flex gap-[2px] items-end h-3 shrink-0">
                      {[0.6,1,0.7].map((h,j) => (
                        <motion.span key={j} className="w-[2px] bg-primary rounded-full"
                          animate={{ height: [`${h*6}px`, "12px", `${h*6}px`] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: j*0.15, ease:"easeInOut" }}
                        />
                      ))}
                    </span>
                  ) : (
                    <span className="w-3 h-3 shrink-0 flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                    </span>
                  )}
                  <span className="truncate">{t.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1.5">
        {playing && (
          <>
            <motion.button initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
              onClick={prev}
              className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-md border border-border/30 shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
              onClick={next}
              className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-md border border-border/30 shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </motion.button>
          </>
        )}

        <motion.button
          onClick={() => setShowPanel(s => !s)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border/30 shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          title="Danh sách nhạc"
        >
          <Music className="w-4 h-4" />
        </motion.button>

        <motion.button
          onClick={toggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center relative transition-all border-2 ${
            playing
              ? "bg-primary text-white border-primary/50 shadow-primary/30"
              : "bg-background/90 backdrop-blur-md border-border/30 text-muted-foreground hover:text-primary"
          }`}
          title={playing ? "Tắt nhạc" : "Bật nhạc"}
        >
          {playing ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          {playing && <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />}
        </motion.button>
      </div>

      {playing && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border/30 rounded-full px-3 py-1 shadow-md max-w-[180px]"
        >
          <span className="flex gap-[2px] items-end h-3 shrink-0">
            {[0.6,1,0.7,0.9,0.5].map((h,i) => (
              <motion.span key={i} className="w-[2px] bg-primary rounded-full"
                animate={{ height: [`${h*8}px`, "12px", `${h*8}px`] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: i*0.1, ease:"easeInOut" }}
              />
            ))}
          </span>
          <span className="text-[10px] font-medium text-foreground truncate">{TRACKS[trackIdx].title}</span>
        </motion.div>
      )}
    </div>
  );
}
