import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Home, User, Sparkles, Heart, GraduationCap, Images,
  Gift, BadgeCheck, ChevronRight, Facebook, Share2,
  Sun, Moon, Star, MessageCircle
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
  { href: "/gallery", label: "Bộ ảnh", icon: Images, desc: "68 khoảnh khắc", isLink: true },
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
      alert("Đã copy link rồi nhé! 🩷");
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col gap-[5px] p-2 rounded-xl hover:bg-primary/10 transition-colors group"
        aria-label="Menu"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-[2.5px] bg-foreground rounded-full"
            style={{ width: i === 1 ? "18px" : "24px" }}
          />
        ))}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 35 }}
              className="fixed top-0 left-0 h-full w-80 z-[100] bg-background/95 backdrop-blur-2xl border-r border-border/40 shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/30 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-serif font-bold text-primary">Minh Thư</span>
                  <BadgeCheck className="w-5 h-5 text-blue-500" fill="currentColor" stroke="white" />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile mini */}
              <div className="px-6 py-5 border-b border-border/20 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/30 shrink-0">
                    <img src="/main2.png" alt="Thư" className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Thư Sói 🐺</p>
                    <p className="text-xs text-muted-foreground mt-0.5">11/11/2011 — Cổ Bì, Hải Phòng</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      <span className="text-xs text-green-600 font-medium">Đang online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section label */}
              <div className="px-6 pt-5 pb-2 shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Điều hướng</p>
              </div>

              {/* Nav Links */}
              <nav className="px-4 pb-2 space-y-1 shrink-0">
                {navLinks.map(({ href, label, icon: Icon, desc, isLink }, i) => (
                  <motion.button
                    key={href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNav(href, isLink)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-left hover:bg-primary/10 hover:text-primary transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-tight">{label}</p>
                        <p className="text-[11px] text-muted-foreground leading-tight">{desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                  </motion.button>
                ))}
              </nav>

              {/* Quick actions */}
              <div className="px-6 pt-4 pb-2 shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3">Tính năng</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: dark ? Sun : Moon, label: dark ? "Sáng" : "Tối", action: toggleDark },
                    { icon: Share2, label: "Chia sẻ", action: share },
                    {
                      icon: Facebook, label: "Facebook",
                      action: () => { setOpen(false); window.open("https://www.facebook.com/anhh.thhu.6537147", "_blank"); }
                    },
                    {
                      icon: MessageCircle, label: "Nhắn tin",
                      action: () => { setOpen(false); window.open("https://www.facebook.com/anhh.thhu.6537147", "_blank"); }
                    },
                    {
                      icon: Star, label: "Yêu thích",
                      action: () => { setOpen(false); document.querySelector("#hobbies")?.scrollIntoView({ behavior: "smooth" }); }
                    },
                    {
                      icon: Images, label: "68 ảnh",
                      action: () => { setOpen(false); window.location.href = "/gallery"; }
                    },
                  ].map(({ icon: Icon, label, action }, i) => (
                    <motion.button
                      key={label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      onClick={action}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all group text-center"
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-semibold leading-tight">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Donate Button */}
              <div className="px-4 py-5 border-t border-border/30 mt-auto shrink-0">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => { setOpen(false); onDonate(); }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-400 to-primary text-white font-bold text-sm shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                >
                  <Gift className="w-5 h-5" />
                  Góp tiền nuôi Thư Sói 🐺
                </motion.button>
                <p className="text-center text-[11px] text-muted-foreground mt-2">Ủng hộ Thư thêm động lực mỗi ngày 🩷</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
