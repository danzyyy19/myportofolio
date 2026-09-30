"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, X, Check } from "lucide-react";

type AIAssistantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (text: string) => void;
  contextType: "summary" | "experience" | "project" | "skills";
  currentValue?: string;
};

export function AIAssistantModal({ isOpen, onClose, onAccept, contextType, currentValue }: AIAssistantModalProps) {
  const [prompt, setPrompt] = useState("");
  
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const systemPrompts = {
    summary: "Anda adalah penulis profesional. Buat ringkasan profil (about me) untuk portofolio berdasarkan input berikut. Buat terdengar elegan, profesional, dan to-the-point.",
    experience: "Anda adalah penulis resume profesional. Tulis deskripsi pekerjaan atau tanggung jawab berdasarkan input berikut. Gunakan bullet points jika perlu.",
    project: "Anda adalah copywriter tech. Buat deskripsi proyek portofolio berdasarkan input berikut. Jelaskan masalah, solusi, dan dampaknya dengan profesional.",
    skills: "Kelompokkan dan format daftar skill berikut menjadi koma yang rapi atau kategori yang sesuai."
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setCompletion("");
    
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemPrompt: systemPrompts[contextType]
        })
      });
      
      if (!res.ok) {
        throw new Error("Gagal terhubung ke AI. Pastikan API Key valid.");
      }
      
      const data = await res.json();
      setCompletion(data.text);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Terjadi kesalahan saat memanggil AI");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-background border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-serif text-lg text-foreground">AI Assistant</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
              <div className="text-sm text-muted-foreground">
                Ceritakan apa yang ingin Anda tulis. AI akan membantu merangkai kata-katanya agar terlihat profesional.
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Contoh: Saya kerja 3 tahun sebagai frontend, bisa React dan Next.js, suka bikin web kenceng dan animasi keren..."
                  className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent min-h-[100px] resize-none"
                />
                
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="flex items-center justify-center gap-2 bg-accent text-accent-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </button>
              </form>

              {/* Result Area */}
              {completion && (
                <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Hasil AI</span>
                  <div className="p-3 bg-muted/30 border border-border rounded-xl text-sm whitespace-pre-wrap">
                    {completion}
                  </div>
                  
                  {!isLoading && (
                    <button
                      onClick={() => {
                        onAccept(completion);
                        onClose();
                      }}
                      className="flex items-center justify-center gap-2 border border-border hover:border-accent text-foreground hover:text-accent py-2 rounded-xl text-sm font-medium transition-colors mt-2"
                    >
                      <Check className="w-4 h-4" />
                      Gunakan Teks Ini
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
