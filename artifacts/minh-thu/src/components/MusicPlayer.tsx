import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, VolumeX, Volume2 } from "lucide-react";

const TRACKS = [
  {
    title: "Nỗ Lực Học Tập 📚",
    url: "/music/no-luc-hoc-tap.mp3",
  },
  {
    title: "Lofi Chill ☁️",
    url: "https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3",
  },
  {
    title: "Soft Piano 🎹",
    url: "https://assets.mixkit.co/music/preview/mixkit-life-is-a-dream-837.mp3",
  },
  {
    title: "Nhẹ nhàng 🌸",
    url: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
  },
];

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(TRACKS[trackIdx].url);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [trackIdx]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
      setShowLabel(true);
      setTimeout(() => setShowLabel(false), 2500);
    }
  };

  const nextTrack = () => {
    audioRef.current?.pause();
    setPlaying(false);
    setTrackIdx((i) => (i + 1) % TRACKS.length);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
      setPlaying(true);
    }, 200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Track label */}
      <AnimatePresence>
        {showLabel && playing && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-background/90 backdrop-blur-md border border-border/40 shadow-xl rounded-2xl px-4 py-2 flex items-center gap-2 text-sm font-medium"
          >
            <Music className="w-3.5 h-3.5 text-primary animate-pulse" />
            {TRACKS[trackIdx].title}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {/* Next track */}
        {playing && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={nextTrack}
            className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-md border border-border/30 shadow-lg flex items-center justify-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            title="Bài tiếp theo"
          >
            ⏭
          </motion.button>
        )}

        {/* Play/Pause */}
        <motion.button
          onClick={toggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all border-2 ${
            playing
              ? "bg-primary text-white border-primary/50 shadow-primary/30"
              : "bg-background/90 backdrop-blur-md border-border/30 text-muted-foreground hover:text-primary"
          }`}
          title={playing ? "Tắt nhạc" : "Bật nhạc"}
        >
          {playing ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
          {playing && (
            <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
          )}
        </motion.button>
      </div>

      {/* Equalizer bars when playing */}
      {playing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-end gap-[3px] h-4"
        >
          {[0.6, 1, 0.7, 0.9, 0.5].map((h, i) => (
            <motion.span
              key={i}
              className="w-[3px] bg-primary rounded-full"
              animate={{ height: ["4px", `${h * 16}px`, "4px"] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
