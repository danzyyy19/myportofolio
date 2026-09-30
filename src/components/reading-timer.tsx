"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function ReadingTimer() {
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    // Tampilkan notifikasi setelah 60 detik
    const timer = setTimeout(() => {
      if (!hasNotified) {
        toast.custom(
          (t) => (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-background/95 backdrop-blur-xl border border-border/60 p-5 flex flex-col gap-4 rounded-2xl shadow-2xl max-w-[320px] w-full relative overflow-hidden group"
            >
              {/* Subtle accent glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex gap-3 relative z-10">
                <div className="w-8 h-8 rounded-full border border-border bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>
                <div>
                  <h4 className="text-foreground font-medium text-sm mb-1 tracking-tight">Available for new opportunities</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Sedang mencari kandidat IT/Admin? Mari jadwalkan diskusi singkat.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-1 relative z-10">
                <button
                  onClick={() => {
                    toast.dismiss(t);
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-1 bg-foreground text-background py-2 text-xs font-medium rounded-xl hover:bg-foreground/90 transition-colors"
                >
                  Hubungi
                </button>
                <button
                  onClick={() => toast.dismiss(t)}
                  className="px-4 bg-muted text-muted-foreground border border-transparent py-2 text-xs font-medium rounded-xl hover:border-border hover:text-foreground transition-all"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          ),
          { duration: 10000, position: 'bottom-right' }
        );
        setHasNotified(true);
      }
    }, 60000); // 60 detik

    return () => clearTimeout(timer);
  }, [hasNotified]);

  return null;
}
