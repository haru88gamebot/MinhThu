import React, { useState, useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  BadgeCheck, Heart, MapPin, Calendar, BookOpen, Ruler,
  ArrowRight, HeartPulse, GraduationCap,
  Lock, EyeOff, Palette, Target, ChevronDown, Facebook, Sparkles, KeyRound, Unlock
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import GalleryPicker from "@/pages/gallery-picker";
import Gallery from "@/pages/gallery";
import { FloatingParticles } from "@/components/FloatingParticles";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { DonationModal } from "@/components/DonationModal";
import { MusicPlayer } from "@/components/MusicPlayer";
import { MilestoneBanner } from "@/components/MilestoneBanner";

const EXAM_DATE = new Date("2026-05-31T07:30:00");
const LOVE_START = new Date("2026-03-26T00:00:00");

const getDaysInLove = () => {
  const diff = +new Date() - +LOVE_START;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const calculateTimeLeft = () => {
  const difference = +EXAM_DATE - +new Date();
  if (difference > 0) {
    return {
      ngày: Math.floor(difference / (1000 * 60 * 60 * 24)),
      giờ: Math.floor((difference / (1000 * 60 * 60)) % 24),
      phút: Math.floor((difference / 1000 / 60) % 60),
      giây: Math.floor((difference / 1000) % 60),
    };
  }
  return {} as Record<string, number>;
};

const isLastDay = () => {
  const difference = +EXAM_DATE - +new Date();
  return difference > 0 && difference <= 1000 * 60 * 60 * 24;
};

const hobbies = [
  { label: "Chụp ảnh", icon: "📸" },
  { label: "Mua sắm thời trang", icon: "👗" },
  { label: "Đi chơi", icon: "🎡" },
  { label: "Ngủ", icon: "💤" },
  { label: "Sân si", icon: "😤" },
  { label: "Nói xấu", icon: "🗣️" },
  { label: "Màu hồng", icon: "🩷" },
  { label: "Thư Sói", icon: "🐺" },
];

function AnimatedCounter({ value, label, max }: { value: number; label: string; max: number }) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="flex flex-col items-center relative">
      <div className="w-24 h-24 md:w-32 md:h-32 relative flex items-center justify-center mb-3 group">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
          <motion.circle 
            cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="4"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
        <div className="w-20 h-20 md:w-28 md:h-28 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner border border-white/20">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl md:text-4xl font-bold tabular-nums"
            >
              {String(value).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="text-sm md:text-base uppercase tracking-wider font-semibold opacity-90">{label}</span>
    </div>
  );
}

function Home() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [activeSection, setActiveSection] = useState("home");
  const [donationOpen, setDonationOpen] = useState(false);
  const [heroImg, setHeroImg] = useState(0);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [secretPwd, setSecretPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);

  const VALID_PASSWORDS = ["19112007-11112011", "11112011"];

  const checkPassword = () => {
    if (VALID_PASSWORDS.includes(secretPwd.trim())) {
      setSecretUnlocked(true);
      setPwdError(false);
    } else {
      setPwdError(true);
      setTimeout(() => setPwdError(false), 1500);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroImg((i) => (i + 1) % 2), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const nameLetters = "Minh Thư".split("");
  const taglineWords = "Nhỏ nhắn nhưng mạnh mẽ — như đoá hoa anh đào giữa chiều vàng.".split(" ");

  return (
    <div className="relative min-h-screen bg-background overflow-hidden text-foreground selection:bg-primary/30">
      <FloatingParticles />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-rose-400 to-primary z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex items-center gap-4 backdrop-blur-xl bg-background/50 border-b border-border/30">
        <HamburgerMenu onDonate={() => setDonationOpen(true)} />
        <a href="#home" className="text-xl font-serif font-bold text-primary flex items-center gap-1 group mr-auto">
          Minh Thư <BadgeCheck className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" fill="currentColor" stroke="white" />
        </a>
        <div className="hidden md:flex gap-8 font-medium text-sm">
          {["about", "hobbies", "relationship", "exam"].map((id) => (
            <a 
              key={id} 
              href={`#${id}`} 
              className={`transition-all duration-300 relative ${activeSection === id ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              {{about: "Giới thiệu", hobbies: "Sở thích", relationship: "Tình cảm", exam: "Mục tiêu"}[id]}
              {activeSection === id && (
                <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </a>
          ))}
          <a href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Ảnh</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yHero, opacity: opacityHero, scale: scaleHero }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background z-10" />
          <img src="/hero-bg.png" alt="Hero background" className="w-full h-full object-cover opacity-70 mix-blend-overlay" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          {/* Two main photos with crossfade slideshow effect */}
          <div className="flex items-end justify-center gap-4 mb-8">
            {/* Left photo */}
            <motion.div
              initial={{ opacity: 0, x: -40, rotate: -3 }}
              animate={{ opacity: 1, x: 0, rotate: -4 }}
              transition={{ duration: 0.9, delay: 0.1, type: "spring" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/30 rounded-3xl blur-xl animate-pulse-glow"></div>
              <div className="w-36 h-48 md:w-48 md:h-64 rounded-3xl overflow-hidden border-4 border-white/60 shadow-2xl relative z-10 ring-2 ring-primary/30">
                {/* Crossfade between photos */}
                <AnimatePresence mode="crossfade">
                  <motion.img
                    key={heroImg === 0 ? "m1" : "m2"}
                    src={heroImg === 0 ? "/main1.png" : "/main2.png"}
                    alt="Minh Thư"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Right photo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, type: "spring" }}
              className="relative -mb-4"
            >
              <div className="absolute inset-0 bg-rose-400/30 rounded-3xl blur-xl animate-pulse-glow"></div>
              <div className="w-44 h-60 md:w-60 md:h-80 rounded-3xl overflow-hidden border-4 border-white/70 shadow-2xl relative z-10 ring-2 ring-rose-300/40">
                <AnimatePresence mode="crossfade">
                  <motion.img
                    key={heroImg === 1 ? "m1b" : "m2b"}
                    src={heroImg === 1 ? "/main1.png" : "/main2.png"}
                    alt="Minh Thư"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </AnimatePresence>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center shadow-lg z-20">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          </div>
          
          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mb-2">
            {[0, 1].map((i) => (
              <button
                key={i}
                onClick={() => setHeroImg(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${heroImg === i ? "w-6 bg-primary" : "w-2 bg-white/40"}`}
              />
            ))}
          </div>

          <span className="inline-block py-1.5 px-4 rounded-full bg-secondary/80 text-secondary-foreground text-xs font-semibold tracking-widest mb-6 backdrop-blur-md border border-white/20 shadow-sm uppercase">
            Digital Identity Card
          </span>
          
          <h1 className="text-5xl md:text-8xl font-bold font-serif mb-6 flex items-center justify-center gap-3 overflow-hidden">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={letter === " " ? "mr-4" : ""}
              >
                {letter}
              </motion.span>
            ))}
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, type: "spring" }}>
              <BadgeCheck className="w-10 h-10 md:w-14 md:h-14 text-blue-500 drop-shadow-md" fill="currentColor" stroke="white" />
            </motion.div>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-light mb-6 italic h-20 md:h-auto">
            {taglineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </p>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
            className="text-lg text-primary font-semibold mb-10 tracking-wider flex items-center justify-center gap-2"
          >
            <HeartPulse className="w-5 h-5 text-primary animate-heartbeat" /> Yêu V
          </motion.p>
          
          <motion.a 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}
            href="#about" 
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-1 font-medium backdrop-blur-md"
          >
            Khám phá thêm <ArrowRight className="w-4 h-4 animate-bounce-x" />
          </motion.a>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs uppercase tracking-widest font-semibold">Cuộn</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Hồ sơ cá nhân</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-rose-300 rounded-full"></div>
            </motion.div>

            <div className="space-y-4">
              {[
                { icon: <span className="font-serif font-bold text-2xl">T</span>, label: "Biệt danh", value: "Thư Sói 🐺" },
                { icon: <Calendar className="w-6 h-6" />, label: "Ngày sinh", value: "11/11/2011" },
                { icon: <MapPin className="w-6 h-6" />, label: "Quê quán", value: "Cổ Bì, Bình Giang, TP Hải Phòng" },
                { icon: <BookOpen className="w-6 h-6" />, label: "Học vấn", value: "THCS Cổ Bì" },
                { icon: <Ruler className="w-6 h-6" />, label: "Ngoại hình", value: "~1m47 | ~38kg" },
                { icon: <Palette className="w-6 h-6" />, label: "Màu yêu thích", value: "Hồng 🩷" },
              ].map(({ icon, label, value }, i) => (
                <motion.div 
                  key={label} 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 100 }}
                  className="flex items-center gap-5 p-5 rounded-2xl glass-card hover:bg-white/60 dark:hover:bg-black/60 transition-all group cursor-default hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-500 shadow-inner">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">{label}</p>
                    <p className="font-semibold text-xl">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Avatar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-rose-400 to-lavender-400 rounded-[2.5rem] blur-xl opacity-30 animate-pulse-glow"></div>
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden relative shadow-2xl border-[6px] border-white/50 p-2 glass-card">
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                <img
                  src="/main2.png"
                  alt="Minh Thư"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <h3 className="text-white font-serif text-3xl font-bold mb-1 flex items-center gap-2">Minh Thư <BadgeCheck className="w-6 h-6 text-blue-400" fill="white" stroke="currentColor"/></h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span> Đang online
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hobbies & Personality Section */}
      <section id="hobbies" className="py-32 px-6 md:px-12 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10"></div>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 animate-float-slow" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Sở thích & Tính cách</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-rose-300 rounded-full mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: "📸", title: "Chụp ảnh", desc: "Thư thích chụp ảnh lắm — nhưng lại hay ngại khi bị người khác chụp. Thư chụp người chứ không thích người chụp Thư 😅" },
              { icon: "👗", title: "Mua sắm & Đi chơi", desc: "Mua đồ thời trang và đi chơi là hai thứ Thư không bao giờ chán — nhỏ nhắn nhưng phong cách cực kỳ có gu!" },
              { icon: "💤", title: "Ngủ & Sân si", desc: "Ngủ là đam mê số một. Còn sân si và nói xấu? Ai chứ Thư Sói thì không che giấu bao giờ — honest queen 👑" }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="glass-card rounded-[2rem] p-8 text-center hover:-translate-y-3 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 group"
              >
                <div className="text-6xl mb-6 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500 drop-shadow-lg inline-block">{item.icon}</div>
                <h3 className="font-serif font-bold text-2xl mb-3 text-primary">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-4 justify-center">
            {hobbies.map(({ label, icon }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, type: "spring", bounce: 0.5 }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card border border-primary/20 text-base font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer shadow-sm"
              >
                <span className="text-xl">{icon}</span> {label}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Relationship Section */}
      <section id="relationship" className="py-32 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-secondary/30 -skew-y-2 transform origin-top-left -z-10"></div>
        
        {/* Floating tiny hearts */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-400/30 text-2xl"
              initial={{ x: Math.random() * window.innerWidth, y: 1000 }}
              animate={{ y: -100, x: `+=${Math.random() * 100 - 50}`, rotate: 360 }}
              transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
            >
              ❤️
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block p-4 rounded-full bg-rose-100/50 backdrop-blur-md mb-8 shadow-inner border border-rose-200/50">
              <HeartPulse className="w-16 h-16 text-rose-500 animate-heartbeat drop-shadow-md" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">Góc nhỏ bí mật</h2>

            {/* Days in love counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="inline-flex flex-col items-center gap-2 mb-10"
            >
              <div className="flex items-center gap-4 bg-gradient-to-r from-rose-400/20 via-primary/20 to-rose-400/20 backdrop-blur-md border border-rose-300/40 rounded-3xl px-8 py-5 shadow-xl">
                <div className="flex flex-col items-center">
                  <Heart className="w-6 h-6 text-rose-500 animate-heartbeat mb-1" fill="currentColor" />
                  <span className="text-4xl md:text-5xl font-bold font-serif text-primary tabular-nums">{getDaysInLove()}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mt-1">ngày</span>
                </div>
                <div className="w-px h-14 bg-rose-200/60" />
                <div className="text-left">
                  <p className="font-serif font-bold text-lg text-foreground leading-tight">Thư & Vũ</p>
                  <p className="text-sm text-muted-foreground">từ 26/03/2026</p>
                  <p className="text-xs text-rose-400 font-medium mt-0.5">yêu nhau đến hôm nay 🩷</p>
                </div>
              </div>
            </motion.div>

            <div className="glass-card p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100/20 via-transparent to-rose-200/20 animate-shimmer mix-blend-overlay"></div>

              <AnimatePresence mode="wait">
                {!secretUnlocked ? (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative"
                  >
                    {/* Blurred preview */}
                    <div className="relative mb-8 py-10 rounded-2xl border border-white/20 bg-white/10 shadow-inner overflow-hidden">
                      <div className="select-none pointer-events-none blur-[8px] opacity-30 space-y-3 px-6">
                        <p className="font-serif text-2xl">Hai năm trước, trong một buổi trại hè...</p>
                        <p className="text-lg">Thư đã thầm thích anh từ lần đầu gặp nhau...</p>
                        <p className="text-base">Tháng Hai năm nay, hội đền — định mệnh lại sắp đặt...</p>
                        <p className="text-base">Và rồi điều Thư không dám tin đã xảy ra... 💕</p>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, -8, 8, -8, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center border border-rose-100"
                        >
                          <Lock className="w-8 h-8 text-rose-400" />
                        </motion.div>
                        <span className="text-xs font-bold text-rose-500 bg-white/90 px-4 py-1.5 rounded-full border border-rose-100 flex items-center gap-1.5 uppercase tracking-wider">
                          <EyeOff className="w-3.5 h-3.5" /> Nội dung riêng tư
                        </span>
                      </div>
                    </div>

                    {/* Password input */}
                    <div className="text-center mb-6">
                      <p className="text-muted-foreground font-serif italic mb-5">Nhập mật khẩu để đọc câu chuyện của Thư và Vũ 🔐</p>
                      <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                        <motion.div
                          animate={pwdError ? { x: [-8, 8, -8, 8, 0] } : {}}
                          transition={{ duration: 0.4 }}
                          className="flex-1"
                        >
                          <input
                            type="password"
                            value={secretPwd}
                            onChange={(e) => setSecretPwd(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && checkPassword()}
                            placeholder="Nhập mật khẩu..."
                            className={`w-full px-5 py-3 rounded-2xl border-2 bg-background/80 backdrop-blur-sm text-center font-mono tracking-widest outline-none transition-all ${
                              pwdError ? "border-red-400 shake" : "border-border/40 focus:border-primary"
                            }`}
                          />
                        </motion.div>
                        <button
                          onClick={checkPassword}
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-primary text-white font-semibold shadow-md hover:-translate-y-0.5 hover:shadow-primary/30 transition-all"
                        >
                          <KeyRound className="w-4 h-4" /> Mở
                        </button>
                      </div>
                      {pwdError && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-3 font-medium"
                        >
                          ❌ Sai mật khẩu rồi! Thử lại nhé...
                        </motion.p>
                      )}
                    </div>

                    <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto my-8"></div>
                    <a
                      href="https://www.facebook.com/anhh.thhu.6537147"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 text-lg"
                    >
                      <Facebook className="w-6 h-6" /> Nhắn tin với Minh Thư
                    </a>
                  </motion.div>
                ) : (
                  <motion.div
                    key="unlocked"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-left"
                  >
                    {/* Unlocked badge */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.6 }}
                        className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-5 py-2.5 rounded-full font-semibold text-sm shadow-sm"
                      >
                        <Unlock className="w-4 h-4" /> Đã mở khoá — Chào mừng 💕
                      </motion.div>
                    </div>

                    {/* Story title */}
                    <div className="text-center mb-10">
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">Chuyện của Thư & Anh</h3>
                      <div className="flex items-center justify-center gap-2 text-rose-400">
                        <Heart className="w-4 h-4" fill="currentColor" />
                        <span className="text-sm font-medium italic">Câu chuyện chỉ dành cho người đặc biệt</span>
                        <Heart className="w-4 h-4" fill="currentColor" />
                      </div>
                    </div>

                    {/* Story paragraphs */}
                    {[
                      {
                        icon: "🌿",
                        title: "Lần đầu gặp nhau",
                        text: "Hai năm trước, trong một buổi trại hè tổ chức tại xã, số phận đã khéo léo sắp đặt cho hai con người xa lạ có dịp gặp nhau lần đầu. Lúc đó, Thư chỉ là một cô bé nhỏ bé ngại ngùng — còn anh Vũ, chàng trai ấy đã vô tình để lại trong lòng Thư một cảm xúc mà Thư không biết phải gọi tên là gì...",
                      },
                      {
                        icon: "🌙",
                        title: "Thích thầm, lặng lẽ",
                        text: "Thích thầm. Lặng lẽ. Và cất giữ riêng cho mình. Rồi sau đó, những tin nhắn dần thưa vắng — anh Vũ không còn nhắn tin cho Thư nữa. Cuộc sống tiếp diễn, nhưng trong tim Thư — hình ảnh của anh vẫn còn đó, như một nốt nhạc bỏ lỡ chờ được cất lên.",
                      },
                      {
                        icon: "🏮",
                        title: "Hội đền tháng Hai",
                        text: "Tháng Hai năm nay, giữa tiếng trống hội đền rộn ràng, hai người lại vô tình chạm mặt nhau. Chỉ vài giây nhìn nhau — nhưng với Thư, khoảnh khắc đó đủ để cô quyết định: Lần này, mình sẽ không để lỡ nữa. Đêm hôm đó, Thư đã rủ thêm một người bạn, vòng vèo tìm nhà anh Vũ trong bóng tối — không tìm được, nhưng lại tình cờ nhìn thấy anh đang đi về cùng bạn bè.",
                      },
                      {
                        icon: "💌",
                        title: "Dũng cảm bày tỏ",
                        text: "Từ hôm đó, những tin nhắn bắt đầu kết nối trở lại. Thư dần dũng cảm hơn — và rồi, Thư đã bày tỏ. Anh từ chối. Nhưng Thư Sói đâu có bỏ cuộc dễ thế. Kiên trì, chân thành, và đặc biệt là... quá đáng yêu — cô bé ấy cứ thế ở đó, không ồn ào nhưng không vắng mặt.",
                      },
                      {
                        icon: "🌸",
                        title: "Điều không ngờ tới",
                        text: "Và rồi, điều Thư không dám tin đã xảy ra — anh Vũ tỏ tình với Thư. Thư ngạc nhiên đến mức hỏi lại cho chắc. Một lần. Hai lần. Và anh vẫn khẳng định — đó là sự thật. Từ hôm đó, Thư và anh Vũ đã yêu nhau. 💕",
                      },
                    ].map((para, i) => (
                      <motion.div
                        key={para.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.15 }}
                        className="flex gap-5 mb-7 glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform"
                      >
                        <span className="text-3xl shrink-0 mt-0.5">{para.icon}</span>
                        <div>
                          <h4 className="font-serif font-bold text-lg text-primary mb-2">{para.title}</h4>
                          <p className="text-muted-foreground leading-relaxed">{para.text}</p>
                        </div>
                      </motion.div>
                    ))}

                    {/* Ending */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="mt-10 p-8 rounded-3xl bg-gradient-to-br from-rose-50/80 to-primary/10 border border-rose-200/50 text-center"
                    >
                      <div className="text-4xl mb-4">💕</div>
                      <p className="font-serif italic text-xl text-foreground leading-relaxed mb-4">
                        Thư mong rằng — câu chuyện này sẽ có một cái kết thật đẹp. Như trong những trang truyện mà Thư vẫn hay vẽ — nơi hai người bên nhau, không cần nói nhiều, chỉ cần có nhau là đủ.
                      </p>
                      <p className="text-primary font-bold text-lg">Mãi bên nhau nhé, anh Vũ ❤️</p>
                    </motion.div>

                    <div className="text-center mt-8">
                      <button
                        onClick={() => { setSecretUnlocked(false); setSecretPwd(""); }}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                      >
                        Khoá lại
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Countdown / Exam Section */}
      <section id="exam" className="py-32 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-[3rem] p-10 md:p-20 text-white text-center relative overflow-hidden shadow-2xl border border-white/20 animate-gradient-xy bg-gradient-to-br from-primary via-rose-400 to-purple-400"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/hero-bg.png')] opacity-20 bg-cover mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

          <div className="relative z-10">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <GraduationCap className="w-24 h-24 mx-auto mb-8 drop-shadow-lg text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-md">Kỳ thi vào Cấp 3</h2>
            
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-4 mt-2 shadow-inner border border-white/30">
              <Target className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold text-base md:text-lg tracking-wide">Mục tiêu: Trường THPT Đường An</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2 rounded-full mb-10 shadow-inner border border-white/20">
              <span className="text-yellow-200 text-sm font-semibold">📅 Chủ nhật — 31/05/2026 lúc 7:30 sáng</span>
            </div>
            
            {Object.keys(timeLeft).length > 0 ? (
              <>
                <p className="text-xl md:text-2xl font-light opacity-90 mb-16 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                  {isLastDay()
                    ? "🌟 Ngày mai là ngày thi rồi! Ngủ sớm, ăn no, và thi thật tốt nhé Minh Thư! 💪"
                    : "Thời gian đếm ngược đến dấu mốc quan trọng nhất! Cố lên Minh Thư! 💪"}
                </p>
                <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                  <AnimatedCounter value={timeLeft.ngày} label="Ngày" max={365} />
                  <AnimatedCounter value={timeLeft.giờ} label="Giờ" max={24} />
                  <AnimatedCounter value={timeLeft.phút} label="Phút" max={60} />
                  <AnimatedCounter value={timeLeft.giây} label="Giây" max={60} />
                </div>
                {isLastDay() && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 max-w-lg mx-auto"
                  >
                    <p className="text-2xl font-bold mb-2">🎯 Ngày mai thi rồi!</p>
                    <p className="text-white/90 font-medium">Hãy nghỉ ngơi thật tốt tối nay. Thư đã chuẩn bị đủ rồi — cứ tự tin mà đi thi nhé! Cả nhà ủng hộ Thư 🩷</p>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="space-y-6"
              >
                <div className="text-6xl mb-4">🎉</div>
                <div className="text-3xl md:text-4xl font-bold bg-white/20 p-8 rounded-3xl backdrop-blur-md border border-white/30">
                  Hôm nay là ngày thi! Chúc Minh Thư thi thật tốt! 🌟
                </div>
                <p className="text-xl opacity-90 font-serif italic">Tự tin lên, Thư Sói đã sẵn sàng rồi! 💪🐺</p>
              </motion.div>
            )}

            <p className="mt-20 text-2xl italic opacity-90 font-serif drop-shadow-md">
              "Thành công không đến từ may mắn,<br className="md:hidden"/> nó đến từ sự nỗ lực không ngừng nghỉ."
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-border/50 relative z-10 bg-background/50 backdrop-blur-md mt-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-center gap-4 mb-8">
            <a href="https://www.facebook.com/anhh.thhu.6537147" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-all hover:-translate-y-1">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
          
          <div className="text-foreground flex items-center justify-center gap-2 font-serif font-bold text-2xl mb-4 group cursor-pointer">
            © 2026 MINH THƯ 
            <motion.span whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.5 }} className="inline-block relative">
               <span className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></span>
               <BadgeCheck className="w-7 h-7 text-blue-500 relative z-10" fill="currentColor" stroke="white" />
            </motion.span>
          </div>
          <p className="text-sm text-muted-foreground font-medium tracking-widest uppercase">Thiết kế với 🩷 và sự chân thành</p>
        </div>
      </footer>

      <DonationModal open={donationOpen} onClose={() => setDonationOpen(false)} />
      <MusicPlayer />
      <MilestoneBanner />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/gallery" component={Gallery} />
        <Route path="/gallery-picker" component={GalleryPicker} />
        <Route component={Home} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
