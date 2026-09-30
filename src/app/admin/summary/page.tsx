"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, UserCircle, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/rich-text-editor";
import { AIAssistantModal } from "@/components/admin/ai-assistant-modal";
import { authClient } from "@/lib/auth-client";
const getSession = async () => (await authClient.getSession()).data;

export default function SummaryPage() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [initialLoading, setInitialLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch(`/api/portfolio/summary`);
        if (res.ok) {
          const data = await res.json();
          setContent(data.content || "");
        }
      } catch (error) {
        console.error("Failed to fetch summary:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchSummary();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;
      
      const res = await fetch(`/api/admin/summary`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ content }),
      });
      
      if (!res.ok) throw new Error("Update failed");
      
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="max-w-4xl"
    >
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
          <UserCircle className="w-8 h-8 text-accent" />
          Professional Summary
        </h1>
        <p className="text-muted-foreground">Update the main descriptive paragraph shown on the homepage.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div variants={itemVariants} className="glass-card !p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-3">
                <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">About Me Content</label>
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 px-2 py-1 rounded-md transition-colors border border-accent/20"
                >
                  <Sparkles className="w-3 h-3" />
                  Tulis dengan AI
                </button>
              </div>
              <span className="text-xs text-muted-foreground">{content.length} characters</span>
            </div>
            <div className="prose-container">
              <RichTextEditor
                content={content}
                onChange={(newContent) => setContent(newContent)}
                placeholder="Write your professional summary here..."
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This text is displayed prominently in the "Ringkasan Profesional" section. Try to keep it concise but descriptive, highlighting your key experiences and skills.
            </p>
          </div>
        </motion.div>

        {/* Submit Area */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Summary
              </>
            )}
          </button>

          {status === "success" && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center gap-2 text-sm text-accent font-medium bg-accent/10 px-4 py-2 rounded-lg border border-accent/20"
            >
              <CheckCircle className="w-4 h-4" />
              Summary updated successfully!
            </motion.div>
          )}

          {status === "error" && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center gap-2 text-sm text-red-500 font-medium bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"
            >
              <AlertCircle className="w-4 h-4" />
              Failed to update summary. Check console.
            </motion.div>
          )}
        </motion.div>
      </form>

      <AIAssistantModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        onAccept={(generatedText) => setContent(generatedText)} 
        contextType="summary" 
      />
    </motion.div>
  );
}
