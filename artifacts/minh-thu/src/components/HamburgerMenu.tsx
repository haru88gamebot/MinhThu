import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Home, User, Sparkles, Heart, GraduationCap, Images,
  Gift, BadgeCheck, Facebook, Share2,
  Sun, Moon, MessageCircle, Camera
} from "lucide-react";

interface Props {
  onDonate: () => void;
}

const navLinks = [
  { href: "#home", label: "Trang chủ", icon: Home, desc: "Quay về đầu trang" },
  { href: "#about", label: "Giới thiệu", icon: User, desc: "Hồ sơ cá nhân" },
  { href: "#hobbies", label: "Sở thích", icon: Sparkles, desc: "Những điều Thư yêu thích" },
  { href: "#relationship", label: "Góc bí mật", icon: Heart, desc: "Câu chuyện riêng tư 🔐" },
  { href: "#exam", label: "Mục tiêu", icon: GraduationCap, desc: "Đếm ngược kỳ thi" },
];

export function HamburgerMenu({ onDonate }: Props) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const handleNav = (href: string, isLink?: boolean) => {
    setOpen(false);
    if (isLink) {
      window.location.href = href;
    } else {
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: "Minh Thư 🌸", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col gap-[5px] p-2.5 rounded-xl hover:bg-primary/10 transition-colors"
        aria-label="Menu"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-[2.5px] bg-foreground rounded-full transition-all"
            style={{ width: i === 1 ? "16px" : "22px" }}
          />
        ))}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Full-screen backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            />

            {/* Full-screen vertical overlay panel */}
            <motion.aside
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed inset-x-0 top-0 z-[100] bg-background/98 backdrop-blur-2xl shadow-2xl flex flex-col overflow-y-auto"
              style={{ maxHeight: "100dvh" }}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-serif font-bold text-primary">Minh Thư</span>
                  <BadgeCheck className="w-4 h-4 text-blue-500" fill="currentColor" stroke="white" />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile mini */}
              <div className="px-5 py-4 border-b border-border/20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/30 shrink-0">
                    <img src="/main2.png" alt="Thư" className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Thư Sói 🐺</p>
                    <p className="text-[11px] text-muted-foreground">11/11/2011 — Cổ Bì, Hải Phòng</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      <span className="text-[10px] text-green-600 font-medium">Đang online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2 big action buttons */}
              <div className="px-4 pt-4 pb-3 grid grid-cols-2 gap-3 shrink-0">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  onClick={() => { setOpen(false); onDonate(); }}
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-gradient-to-br from-rose-400 to-primary text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
                >
                  <Gift className="w-6 h-6" />
                  <span className="text-xs leading-tight text-center">Góp tiền<br/>nuôi Thư Sói 🐺</span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  onClick={() => handleNav("/gallery", true)}
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-500 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs leading-tight text-center">Album ảnh<br/>68 khoảnh khắc 📸</span>
                </motion.button>
              </div>

              {/* Nav Links */}
              <div className="px-4 pb-2 shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-2 mb-2">Điều hướng</p>
                <div className="space-y-1">
                  {navLinks.map(({ href, label, icon: Icon, desc }, i) => (
                    <motion.button
                      key={href}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      onClick={() => handleNav(href)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left hover:bg-primary/10 hover:text-primary active:bg-primary/20 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-tight">{label}</p>
                        <p className="text-[11px] text-muted-foreground leading-tight truncate">{desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick actions grid */}
              <div className="px-4 py-3 shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-2 mb-3">Tính năng nhanh</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    {
                      icon: dark ? Sun : Moon,
                      label: dark ? "Sáng" : "Tối",
                      action: toggleDark,
                      color: "from-slate-400 to-slate-600",
                    },
                    {
                      icon: Share2,
                      label: "Chia sẻ",
                      action: share,
                      color: "from-green-400 to-emerald-500",
                    },
                    {
                      icon: Facebook,
                      label: "Facebook",
                      action: () => { setOpen(false); window.open("https://www.facebook.com/anhh.thhu.6537147", "_blank"); },
                      color: "from-blue-500 to-blue-700",
                    },
                    {
                      icon: MessageCircle,
                      label: "Nhắn tin",
                      action: () => { setOpen(false); window.open("https://www.facebook.com/anhh.thhu.6537147", "_blank"); },
                      color: "from-sky-400 to-cyan-500",
                    },
                  ].map(({ icon: Icon, label, action, color }, i) => (
                    <motion.button
                      key={label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      onClick={action}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl active:scale-95 transition-transform"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground leading-tight">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Bottom safe area */}
              <div className="h-safe-area-inset-bottom pb-6 shrink-0" />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
