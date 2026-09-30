"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, User, MapPin, Phone, Mail, FileText, CheckCircle, AlertCircle, Settings, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { authClient } from "@/lib/auth-client";
const getSession = async () => (await authClient.getSession()).data;

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    heroName: "",
    heroRole: "",
    contactLocation: "",
    contactPhone: "",
    contactEmail: "",
    cvFileUrl: "",
    profileImageUrl: "",
    heroStat1Value: "",
    heroStat1Label: "",
    heroStat2Value: "",
    heroStat2Label: "",
    socialGithub: "",
    socialLinkedin: "",
    socialInstagram: "",
    socialTwitter: "",
    socialWhatsapp: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [initialLoading, setInitialLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      const sess = await getSession();
      setSession(sess);
    }
    fetchSession();
    async function fetchSettings() {
      try {
        const res = await fetch(`/api/portfolio/settings`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            heroName: data.heroName || "",
            heroRole: data.heroRole || "",
            contactLocation: data.contactLocation || "",
            contactPhone: data.contactPhone || "",
            contactEmail: data.contactEmail || "",
            cvFileUrl: data.cvFileUrl || "",
            profileImageUrl: data.profileImageUrl || "",
            heroStat1Value: data.heroStat1Value || "",
            heroStat1Label: data.heroStat1Label || "",
            heroStat2Value: data.heroStat2Value || "",
            heroStat2Label: data.heroStat2Label || "",
            socialGithub: data.socialGithub || "",
            socialLinkedin: data.socialLinkedin || "",
            socialInstagram: data.socialInstagram || "",
            socialTwitter: data.socialTwitter || "",
            socialWhatsapp: data.socialWhatsapp || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // In a real app, you would pass the JWT token here
    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;
      
      const res = await fetch(`/api/admin/settings`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData),
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
          <Settings className="w-8 h-8 text-accent" />
          General Settings
        </h1>
        <p className="text-muted-foreground">Manage your main profile details and contact information.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Image Section */}
        <motion.div variants={itemVariants} className="glass-card !p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-blue-500" />
            Profile Photo
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-border bg-background/50 flex items-center justify-center shrink-0">
              {formData.profileImageUrl ? (
                <img src={formData.profileImageUrl} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground/30" />
              )}
            </div>
            
            <div className="space-y-3 flex-1">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase">Photo (Cloudinary)</label>
              <p className="text-sm text-muted-foreground/70 mb-2">Upload a professional photo for the hero section.</p>
              
              {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                <CldUploadWidget 
                  uploadPreset="portfolio_preset"
                  options={{
                    cropping: true,
                    showSkipCropButton: false,
                    multiple: false,
                    clientAllowedFormats: ["image"],
                    maxFileSize: 200000,
                    folder: session?.user?.id ? `saas_portofolios/${session.user.id}` : "saas_portofolios",
                  }}
                  onSuccess={(result: any) => {
                    setFormData({ ...formData, profileImageUrl: result.info.secure_url });
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm font-medium border border-accent/20"
                    >
                      <ImagePlus className="w-4 h-4" />
                      {formData.profileImageUrl ? "Change Photo" : "Upload Photo"}
                    </button>
                  )}
                </CldUploadWidget>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-2 px-4 py-2 bg-muted/50 text-muted-foreground rounded-lg cursor-not-allowed text-sm font-medium border border-border"
                  >
                    <ImagePlus className="w-4 h-4 opacity-50" />
                    Upload Photo (Disabled)
                  </button>
                  <p className="text-[10px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is missing in .env
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Section 1: Hero Info */}
        <motion.div variants={itemVariants} className="glass-card !p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
          <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            Profile Banner
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Hero Name</label>
              <input
                type="text"
                required
                value={formData.heroName}
                onChange={(e) => setFormData({...formData, heroName: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. Dani"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Hero Role / Tagline</label>
              <input
                type="text"
                required
                value={formData.heroRole}
                onChange={(e) => setFormData({...formData, heroRole: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. Staff Administrasi & Developer"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border/50">
            {/* Stat 1 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                Floating Stat 1 (Bottom Left)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Value</label>
                  <input
                    type="text"
                    value={formData.heroStat1Value}
                    onChange={(e) => setFormData({...formData, heroStat1Value: e.target.value})}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono-ui font-bold text-accent"
                    placeholder="e.g. 3+"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Label</label>
                  <input
                    type="text"
                    value={formData.heroStat1Label}
                    onChange={(e) => setFormData({...formData, heroStat1Label: e.target.value})}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="e.g. Tahun Pengalaman"
                  />
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warm" />
                Floating Stat 2 (Top Right)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Value</label>
                  <input
                    type="text"
                    value={formData.heroStat2Value}
                    onChange={(e) => setFormData({...formData, heroStat2Value: e.target.value})}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-warm focus:ring-1 focus:ring-warm transition-all font-mono-ui font-bold text-warm"
                    placeholder="e.g. IT"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Label</label>
                  <input
                    type="text"
                    value={formData.heroStat2Label}
                    onChange={(e) => setFormData({...formData, heroStat2Label: e.target.value})}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-warm focus:ring-1 focus:ring-warm transition-all"
                    placeholder="e.g. & Administrasi"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Contact Info */}
        <motion.div variants={itemVariants} className="glass-card !p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-warm" />
          <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5 text-warm" />
            Contact Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </label>
              <input
                type="text"
                value={formData.contactLocation}
                onChange={(e) => setFormData({...formData, contactLocation: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. Bogor, Indonesia"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. 0851-XXXX-XXXX"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. admin@dani.dev"
              />
            </div>
          </div>
        </motion.div>

        {/* Section 3: CV Upload */}
        <motion.div variants={itemVariants} className="glass-card !p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" />
            Resume / CV Upload
          </h2>
          
          <div className="space-y-4">
            {formData.cvFileUrl && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 border border-accent/20">
                <FileText className="w-5 h-5 text-accent shrink-0" />
                <a href={formData.cvFileUrl} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline truncate flex-1">
                  {formData.cvFileUrl.split('/').pop() || 'CV Document'}
                </a>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, cvFileUrl: ""})}
                  className="text-xs text-red-500 hover:text-red-400 shrink-0"
                >
                  Remove
                </button>
              </div>
            )}

            {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portofolio_preset"}
                options={{
                  resourceType: "raw",
                  clientAllowedFormats: ["pdf"],
                  maxFileSize: 5000000,
                  multiple: false,
                  sources: ["local", "url"],
                  folder: session?.user?.id ? `saas_portofolios/${session.user.id}/docs` : "saas_portofolios/docs",
                }}
                onSuccess={(result: any) => {
                  setFormData({ ...formData, cvFileUrl: result.info.secure_url });
                  toast.success("CV berhasil diupload!");
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="flex items-center gap-2 px-5 py-3 bg-purple-500/10 text-purple-500 rounded-xl hover:bg-purple-500/20 transition-colors text-sm font-medium border border-purple-500/20"
                  >
                    <FileText className="w-4 h-4" />
                    {formData.cvFileUrl ? "Ganti CV (PDF)" : "Upload CV (PDF)"}
                  </button>
                )}
              </CldUploadWidget>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Cloudinary belum dikonfigurasi. Masukkan link manual:
                </p>
                <input
                  type="text"
                  value={formData.cvFileUrl}
                  onChange={(e) => setFormData({...formData, cvFileUrl: e.target.value})}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="e.g. https://example.com/cv.pdf"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Section 4: Social Links */}
        <motion.div variants={itemVariants} className="glass-card !p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />
          <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            Social Media Links
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">WhatsApp URL</label>
              <input
                type="text"
                value={formData.socialWhatsapp}
                onChange={(e) => setFormData({...formData, socialWhatsapp: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. https://wa.me/628123456789"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">LinkedIn URL</label>
              <input
                type="text"
                value={formData.socialLinkedin}
                onChange={(e) => setFormData({...formData, socialLinkedin: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">GitHub URL</label>
              <input
                type="text"
                value={formData.socialGithub}
                onChange={(e) => setFormData({...formData, socialGithub: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. https://github.com/username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Instagram URL</label>
              <input
                type="text"
                value={formData.socialInstagram}
                onChange={(e) => setFormData({...formData, socialInstagram: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. https://instagram.com/username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono-ui text-muted-foreground tracking-wider uppercase ml-1">Twitter/X URL</label>
              <input
                type="text"
                value={formData.socialTwitter}
                onChange={(e) => setFormData({...formData, socialTwitter: e.target.value})}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. https://twitter.com/username"
              />
            </div>
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
                Save Changes
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
              Settings updated successfully!
            </motion.div>
          )}

          {status === "error" && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center gap-2 text-sm text-red-500 font-medium bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"
            >
              <AlertCircle className="w-4 h-4" />
              Failed to update settings. Check console.
            </motion.div>
          )}
        </motion.div>

      </form>
    </motion.div>
  );
}
