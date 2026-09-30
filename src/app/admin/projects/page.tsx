"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, LayoutTemplate, X, Save, CheckCircle, AlertCircle, ExternalLink, GitBranch, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/rich-text-editor";
import { CldUploadWidget } from "next-cloudinary";
import { authClient } from "@/lib/auth-client";
const getSession = async () => (await authClient.getSession()).data;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showReminder, setShowReminder] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    projectUrl: "",
    repoUrl: "",
    imageUrls: [] as string[],
    sortOrder: 0
  });

  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      const sess = await getSession();
      setSession(sess);
    }
    fetchSession();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/portfolio/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      techStack: "",
      projectUrl: "",
      repoUrl: "",
      imageUrls: [],
      sortOrder: 0
    });
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack || "",
      projectUrl: project.projectUrl || "",
      repoUrl: project.repoUrl || "",
      imageUrls: project.imageUrls?.length > 0 ? project.imageUrls : (project.imageUrl ? [project.imageUrl] : []),
      sortOrder: project.sortOrder || 0
    });
    setEditingId(project.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;
      
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : undefined
      });
      if (res.ok) {
        fetchProjects();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;
      
      const url = editingId 
        ? `/api/admin/projects/${editingId}`
        : `/api/admin/projects`;
        
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
      fetchProjects();
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
            <LayoutTemplate className="w-8 h-8 text-accent" />
            Projects
          </h1>
          <p className="text-muted-foreground">Manage your featured projects and portfolio items.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary shrink-0 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full glass-card !p-12 text-center flex flex-col items-center">
            <LayoutTemplate className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No projects found. Create your first project to showcase your work.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="glass-card flex flex-col hover:border-accent/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(project)} className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{project.description}</p>
              
              <div className="mt-auto space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.split(',').slice(0, 3).map((tech: string, i: number) => (
                    <span key={i} className="skill-tag !text-[10px] !py-0.5">{tech.trim()}</span>
                  ))}
                  {project.techStack?.split(',').length > 3 && (
                    <span className="skill-tag !text-[10px] !py-0.5">+{project.techStack.split(',').length - 3}</span>
                  )}
                </div>
                <div className="flex gap-3 pt-4 border-t border-border">
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Live
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <GitBranch className="w-3 h-3" /> Source
                    </a>
                  )}
                </div>
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
                  {editingId ? "Edit Project" : "Add New Project"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Description</label>
                  <div className="prose-container">
                    <RichTextEditor
                      content={formData.description}
                      onChange={(content) => setFormData({...formData, description: content})}
                      placeholder="Describe the project..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. Next.js, Tailwind CSS, TypeScript"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1 flex items-center justify-between">
                    <span>Project Images (Cloudinary)</span>
                    <span className="text-muted-foreground/60">{formData.imageUrls.length} images</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-4 items-start">
                    {/* Render existing images */}
                    {formData.imageUrls.map((url, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group shrink-0">
                        <img src={url} alt={`Project ${idx + 1}`} className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => {
                            const newUrls = [...formData.imageUrls];
                            newUrls.splice(idx, 1);
                            setFormData({ ...formData, imageUrls: newUrls });
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Upload Button */}
                    {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                      <CldUploadWidget 
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portofolio_preset"}
                        options={{
                          multiple: true,
                          clientAllowedFormats: ["image"],
                          maxFileSize: 200000,
                          folder: session?.user?.id ? `saas_portofolios/${session.user.id}/projects` : "saas_portofolios/projects",
                        }}
                        onSuccess={(result: any) => {
                          setFormData(prev => ({ 
                            ...prev, 
                            imageUrls: [...prev.imageUrls, result.info.secure_url] 
                          }));
                        }}
                      >
                        {({ open }) => (
                          <button
                            type="button"
                            onClick={() => open()}
                            className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-accent/30 rounded-xl text-accent hover:bg-accent/5 hover:border-accent/50 transition-all gap-1"
                          >
                            <ImagePlus className="w-5 h-5" />
                            <span className="text-[10px] uppercase tracking-wider font-mono-ui">Add More</span>
                          </button>
                        )}
                      </CldUploadWidget>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-xl text-muted-foreground bg-muted/20 cursor-not-allowed gap-1"
                      >
                        <ImagePlus className="w-5 h-5 opacity-50" />
                        <span className="text-[10px] uppercase tracking-wider font-mono-ui">Disabled</span>
                      </button>
                    )}
                  </div>
                  {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && (
                    <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is missing in .env
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Live Demo URL</label>
                    <input
                      type="text"
                      value={formData.projectUrl}
                      onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Repository URL</label>
                    <input
                      type="text"
                      value={formData.repoUrl}
                      onChange={(e) => setFormData({...formData, repoUrl: e.target.value})}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Sort Order (Optional)</label>
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
                      <><Save className="w-4 h-4" /> Save Project</>
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
