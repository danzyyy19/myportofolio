"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, User, Link as LinkIcon, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const getSession = async () => (await authClient.getSession()).data;

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/admin/profile`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            username: data.username || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    
    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;
      
      const res = await fetch(`/api/admin/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Update failed");
      }
      
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
      router.refresh();
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
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
          <User className="w-8 h-8 text-accent" />
          Profile & Portfolio Link
        </h1>
        <p className="text-muted-foreground">Claim your unique portfolio username to share with the world.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div variants={itemVariants} className="glass-card !p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
          <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-accent" />
            Claim Your Link
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Portfolio Username</label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
                      portofolio.com/
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono-ui"
                    placeholder="e.g. johndoe"
                  />
              </div>
              <p className="text-xs text-muted-foreground/70 mt-2 ml-1">
                This will be your public portfolio link. Only letters, numbers, and dashes are allowed.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Submit Area */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={status === "loading" || !formData.username}
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
                Save Profile
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
              Profile updated successfully!
            </motion.div>
          )}

          {status === "error" && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center gap-2 text-sm text-red-500 font-medium bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"
            >
              <AlertCircle className="w-4 h-4" />
              {errorMessage || "Failed to update profile."}
            </motion.div>
          )}
        </motion.div>
      </form>
    </motion.div>
  );
}
