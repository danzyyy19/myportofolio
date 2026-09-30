"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Briefcase, X, Save, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/rich-text-editor";
import { authClient } from "@/lib/auth-client";
const getSession = async () => (await authClient.getSession()).data;

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showReminder, setShowReminder] = useState(false);
  
  const [formData, setFormData] = useState({
    companyId: null as number | null,
    companyName: "",
    location: "",
    jobTitle: "",
    period: "",
    description: "",
    sortOrder: 0
  });

  const router = useRouter();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch(`/api/portfolio/experiences`);
      if (res.ok) {
        const data = await res.json();
        // Flatten companies -> experiences for easier admin management
        const flattened = data.flatMap((company: any) => 
          (company.experiences || []).map((exp: any) => ({
            ...exp,
            companyId: company.id,
            companyName: company.name,
            location: company.location,
          }))
        );
        // Sort by sortOrder across all experiences if needed, but they are grouped by company usually.
        // For simple list, just show them as they are.
        setExperiences(flattened);
      }
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      companyId: null,
      companyName: "",
      location: "",
      jobTitle: "",
      period: "",
      description: "",
      sortOrder: 0
    });
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setFormData({
      companyId: item.companyId,
      companyName: item.companyName || "",
      location: item.location || "",
      jobTitle: item.jobTitle || "",
      period: item.period || "",
      description: item.description || "",
      sortOrder: item.sortOrder || 0
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    
    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;
      
      const res = await fetch(`/api/admin/experiences/${id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : undefined
      });
      if (res.ok) {
        fetchExperiences();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete experience:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;
      
      const url = editingId 
        ? `/api/admin/experiences/${editingId}`
        : `/api/admin/experiences`;
        
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Operation failed");
      
      setStatus("success");
      fetchExperiences();
      setTimeout(() => {
        setStatus("idle");
        setIsModalOpen(false);
        resetForm();
      }, 1500);
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
      className="max-w-5xl"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-accent" />
            Experience
          </h1>
          <p className="text-muted-foreground">Manage your work history and professional roles.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary shrink-0 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6">
        {experiences.length === 0 ? (
          <div className="col-span-full glass-card !p-12 text-center flex flex-col items-center">
            <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No experience history found. Add your first entry.</p>
          </div>
        ) : (
          experiences.map((item) => (
            <div key={item.id} className="glass-card flex flex-col sm:flex-row sm:items-start justify-between gap-6 hover:border-accent/30 transition-colors">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h3 className="text-xl font-bold text-foreground">{item.jobTitle}</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 font-mono-ui text-xs text-accent font-medium whitespace-nowrap">
                    {item.period}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground/80">{item.companyName}</span>
                  {item.location && (
                    <>
                      <span className="hidden sm:inline text-border">•</span>
                      <span>{item.location}</span>
                    </>
                  )}
                </div>
                {item.description && (
                  <div 
                    className="prose prose-sm prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEditModal(item)} className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </motion.div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowReminder(true);
                setTimeout(() => setShowReminder(false), 3000);
              }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            {/* Reminder Toast */}
            <AnimatePresence>
              {showReminder && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-10 left-1/2 -translate-x-1/2 z-[60] bg-red-500 text-white px-5 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Silakan gunakan tombol Cancel atau X untuk menutup
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                x: showReminder ? [-10, 10, -10, 10, -5, 5, 0] : 0 
              }}
              transition={{ duration: showReminder ? 0.4 : 0.2 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-card !p-0 overflow-hidden shadow-2xl border-accent/20"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-background/50">
                <h2 className="text-xl font-serif font-bold text-foreground">
                  {editingId ? "Edit Experience" : "Add Experience"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Job Title / Role</label>
                    <input
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Period</label>
                    <input
                      type="text"
                      required
                      value={formData.period}
                      onChange={(e) => setFormData({...formData, period: e.target.value})}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="e.g. 2020 - Present"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Company Name</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="e.g. Tech Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Company Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="e.g. Remote"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Job Description & Achievements</label>
                  <div className="prose-container">
                    <RichTextEditor
                      content={formData.description}
                      onChange={(content) => setFormData({...formData, description: content})}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <button type="submit" disabled={status === "loading"} className="btn-primary">
                    {status === "loading" ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="w-4 h-4" /> Save Experience</>
                    )}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  
                  {status === "error" && (
                    <span className="text-sm text-red-500 font-medium ml-auto flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Error saving
                    </span>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
