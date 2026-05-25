import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Heart, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const BANK = {
  name: "Ngân hàng MB Bank",
  account: "0988770961",
  holder: "PHAM DAC VU",
  content: "goptiennuoithu",
};

export function DonationModal({ open, onClose }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const qrUrl = `https://img.vietqr.io/image/MB-${BANK.account}-compact2.png?amount=&addInfo=${encodeURIComponent(BANK.content)}&accountName=${encodeURIComponent(BANK.holder)}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-background rounded-[2rem] shadow-2xl border border-border/40 w-full max-w-sm overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Gradient top */}
            <div className="h-2 bg-gradient-to-r from-rose-400 via-primary to-purple-400" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 pt-6 pb-7">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-primary/20 flex items-center justify-center mx-auto mb-3 border border-rose-200/50">
                  <span className="text-3xl">🐺</span>
                </div>
                <h2 className="text-xl font-serif font-bold mb-1">Góp tiền nuôi Thư Sói</h2>
                <p className="text-muted-foreground text-xs">Mỗi đồng ủng hộ là thêm một nụ cười cho Thư 🩷</p>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-2xl p-3 mb-4 flex flex-col items-center justify-center shadow-inner border border-border/20">
                <p className="text-xs text-gray-400 mb-2 font-medium">Quét mã để chuyển khoản nhanh</p>
                <img
                  src={qrUrl}
                  alt="QR Chuyển khoản"
                  className="w-44 h-44 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">MB Bank • {BANK.holder}</p>
              </div>

              {/* Bank info */}
              <div className="space-y-2 mb-5">
                {[
                  { label: "Ngân hàng", value: BANK.name, key: "bank" },
                  { label: "Số tài khoản", value: BANK.account, key: "account" },
                  { label: "Chủ tài khoản", value: BANK.holder, key: "holder" },
                  { label: "Nội dung CK", value: BANK.content, key: "content" },
                ].map(({ label, value, key }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 bg-muted/50 rounded-xl px-4 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
                      <p className="font-semibold text-sm mt-0.5 truncate">{value}</p>
                    </div>
                    <button
                      onClick={() => copy(value, key)}
                      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {copied === key ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <div className="text-center flex items-center justify-center gap-1.5 text-muted-foreground text-sm">
                <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
                <span>Cảm ơn bạn đã ủng hộ Thư Sói!</span>
                <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
