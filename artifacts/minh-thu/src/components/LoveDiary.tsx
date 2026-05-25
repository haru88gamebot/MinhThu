import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, BookHeart, X, ChevronDown, ChevronUp, Smile, Lock, ImagePlus, ZoomIn } from "lucide-react";

interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  emoji: string;
  mood: string;
  images?: string[];
}

const STORAGE_KEY = "love_diary_entries";
const DIARY_PWD = "vuyeuthu";

const MOODS = [
  { emoji: "🥰", label: "Hạnh phúc" },
  { emoji: "💕", label: "Yêu lắm" },
  { emoji: "😊", label: "Vui vẻ" },
  { emoji: "🥺", label: "Nhớ anh" },
  { emoji: "😍", label: "Thích lắm" },
  { emoji: "😢", label: "Buồn chút" },
  { emoji: "🤗", label: "Ôm ấm" },
  { emoji: "✨", label: "Đặc biệt" },
];

const DEFAULT_ENTRIES: DiaryEntry[] = [
  {
    id: "default-1",
    date: "2026-03-26",
    title: "Ngày đầu tiên 🌸",
    content: "Hôm nay là ngày đầu tiên chính thức bên nhau. Anh Vũ đã tỏ tình — Thư ngạc nhiên đến mức hỏi lại hai lần mà vẫn không tin. Nhưng đó là sự thật. Thư vui lắm! 💕",
    emoji: "🌸",
    mood: "Hạnh phúc",
    images: [],
  },
];

export function LoveDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Password gate
  const [pwdInput, setPwdInput] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [showPwdPrompt, setShowPwdPrompt] = useState(false);
  const [diaryUnlocked, setDiaryUnlocked] = useState(false);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    title: "",
    content: "",
    emoji: "🥰",
    mood: "Hạnh phúc",
    images: [] as string[],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
      else {
        setEntries(DEFAULT_ENTRIES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ENTRIES));
      }
    } catch {
      setEntries(DEFAULT_ENTRIES);
    }
  }, []);

  const save = (next: DiaryEntry[]) => {
    setEntries(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handlePwdSubmit = () => {
    if (pwdInput === DIARY_PWD) {
      setDiaryUnlocked(true);
      setShowPwdPrompt(false);
      setShowForm(true);
      setPwdInput("");
      setPwdError(false);
    } else {
      setPwdError(true);
      setPwdInput("");
      setTimeout(() => setPwdError(false), 1500);
    }
  };

  const handleAddClick = () => {
    if (diaryUnlocked) {
      setShowForm(s => !s);
    } else {
      setShowPwdPrompt(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = 5 - form.images.length;
    const toProcess = files.slice(0, remaining);
    toProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const result = ev.target?.result as string;
        setForm(f => ({ ...f, images: [...f.images, result] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeFormImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const addEntry = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    const entry: DiaryEntry = {
      id: Date.now().toString(),
      date: form.date,
      title: form.title.trim(),
      content: form.content.trim(),
      emoji: form.emoji,
      mood: form.mood,
      images: form.images,
    };
    const next = [entry, ...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    save(next);
    setForm({ date: new Date().toISOString().split("T")[0], title: "", content: "", emoji: "🥰", mood: "Hạnh phúc", images: [] });
    setShowForm(false);
    setExpanded(entry.id);
  };

  const deleteEntry = (id: string) => {
    save(entries.filter(e => e.id !== id));
    setDeleteConfirm(null);
    if (expanded === id) setExpanded(null);
  };

  const formatDate = (d: string) => {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BookHeart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-foreground">Nhật Ký Tình Yêu</h3>
            <p className="text-xs text-muted-foreground">{entries.length} trang ký ức</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-md shadow-primary/20"
        >
          {diaryUnlocked ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          Thêm kỷ niệm
        </motion.button>
      </div>

      {/* Password Prompt */}
      <AnimatePresence>
        {showPwdPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 glass-card rounded-3xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <h4 className="font-serif font-bold text-primary">Nhập mật khẩu để thêm kỷ niệm</h4>
              </div>
              <button onClick={() => { setShowPwdPrompt(false); setPwdInput(""); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3">
              <input
                type="password"
                value={pwdInput}
                onChange={e => setPwdInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handlePwdSubmit()}
                placeholder="Mật khẩu..."
                autoFocus
                className={`flex-1 bg-background border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  pwdError ? "border-red-400 ring-2 ring-red-200 animate-pulse" : "border-border focus:ring-primary/40"
                }`}
              />
              <button
                onClick={handlePwdSubmit}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Mở
              </button>
            </div>
            {pwdError && (
              <p className="text-red-500 text-xs mt-2 text-center">Sai mật khẩu rồi 🥺</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && diaryUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mb-6 glass-card rounded-3xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-serif font-bold text-lg text-primary">Ghi lại kỷ niệm mới 💌</h4>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ngày</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cảm xúc</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMoodPicker(s => !s)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm flex items-center gap-2 hover:border-primary/50 transition-colors"
                  >
                    <span className="text-lg">{form.emoji}</span>
                    <span className="flex-1 text-left">{form.mood}</span>
                    <Smile className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <AnimatePresence>
                    {showMoodPicker && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 z-20 mt-1 bg-background border border-border rounded-2xl shadow-xl overflow-hidden"
                      >
                        <div className="grid grid-cols-4 p-2 gap-1">
                          {MOODS.map(m => (
                            <button key={m.emoji}
                              onClick={() => { setForm(f => ({ ...f, emoji: m.emoji, mood: m.label })); setShowMoodPicker(false); }}
                              className={`flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 transition-colors ${form.emoji === m.emoji ? "bg-primary/10" : ""}`}
                            >
                              <span className="text-xl">{m.emoji}</span>
                              <span className="text-[10px] text-muted-foreground leading-tight text-center">{m.label}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tiêu đề</label>
              <input
                type="text"
                placeholder="Kỷ niệm đáng nhớ..."
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nội dung</label>
              <textarea
                rows={4}
                placeholder="Kể về kỷ niệm này... mọi chi tiết dù nhỏ cũng đáng nhớ 🩷"
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none placeholder:text-muted-foreground/50 leading-relaxed"
              />
            </div>

            {/* Image upload */}
            <div className="mb-5">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Hình ảnh kỷ niệm <span className="text-muted-foreground/60">({form.images.length}/5)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeFormImage(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
                {form.images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/60 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[10px]">Thêm ảnh</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-2xl border border-border text-muted-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={addEntry}
                disabled={!form.title.trim() || !form.content.trim()}
                className="flex-1 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Lưu kỷ niệm 💕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      {entries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-5xl mb-3">📖</div>
          <p className="text-sm">Chưa có kỷ niệm nào. Thêm kỷ niệm đầu tiên nào! 🌸</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative pl-14"
              >
                <div className="absolute left-3 top-5 w-5 h-5 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center shadow-sm">
                  <span className="text-[10px] leading-none">{entry.emoji}</span>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden border border-border/40 hover:border-primary/30 transition-colors">
                  <button
                    onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                    className="w-full text-left px-5 py-4 flex items-start gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium shrink-0">
                          {entry.mood}
                        </span>
                        {entry.images && entry.images.length > 0 && (
                          <span className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full shrink-0">
                            📷 {entry.images.length} ảnh
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground truncate">{formatDate(entry.date)}</span>
                      </div>
                      <h4 className="font-serif font-bold text-foreground leading-snug">{entry.title}</h4>
                    </div>
                    <div className="shrink-0 mt-1 text-muted-foreground">
                      {expanded === entry.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expanded === entry.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-border/30">
                          <p className="text-muted-foreground leading-relaxed text-sm mt-4 whitespace-pre-wrap">{entry.content}</p>

                          {/* Images */}
                          {entry.images && entry.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                              {entry.images.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setLightbox(img)}
                                  className="relative aspect-square rounded-xl overflow-hidden group"
                                >
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ZoomIn className="w-5 h-5 text-white" />
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {diaryUnlocked && (
                            <div className="flex justify-end mt-4">
                              {deleteConfirm === entry.id ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Xoá kỷ niệm này?</span>
                                  <button onClick={() => setDeleteConfirm(null)} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors">Không</button>
                                  <button onClick={() => deleteEntry(entry.id)} className="text-xs text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium">Xoá</button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(entry.id)}
                                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50/50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Xoá
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[400] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img
              src={lightbox}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
