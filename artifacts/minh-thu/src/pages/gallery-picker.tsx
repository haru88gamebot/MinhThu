import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const TOTAL = 68;

export default function GalleryPicker() {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (selected !== null) {
      setConfirmed(true);
      // Show which photo number was selected so user can tell us
    }
  };

  if (confirmed && selected !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Đã chọn ảnh số {selected}!</h2>
          <p className="text-muted-foreground mb-4">
            Bạn đã chọn <strong>ảnh số {selected}</strong> làm ảnh đại diện.
            Nhắn cho mình biết số <strong>{selected}</strong> để mình cài lên trang nhé! 😊
          </p>
          <img
            src={`/gallery/photo_${selected}.jpg`}
            alt={`Ảnh ${selected}`}
            className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg"
          />
          <button
            onClick={() => { setSelected(null); setConfirmed(false); }}
            className="mt-6 px-4 py-2 rounded-full border border-border text-sm hover:bg-muted transition-colors"
          >
            Chọn lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold font-serif mb-2">Chọn ảnh đại diện</h1>
          <p className="text-muted-foreground text-sm">
            Bấm vào ảnh bạn muốn dùng làm ảnh đại diện trên trang cá nhân
          </p>
          {selected && (
            <button
              onClick={handleConfirm}
              className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow"
            >
              <Check className="w-4 h-4" /> Chọn ảnh số {selected}
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {Array.from({ length: TOTAL }, (_, i) => i + 1).map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(num === selected ? null : num)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all shadow-sm ${
                selected === num
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-transparent hover:border-primary/50"
              }`}
            >
              <img
                src={`/gallery/photo_${num}.jpg`}
                alt={`Ảnh ${num}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {num}
              </span>
              {selected === num && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
