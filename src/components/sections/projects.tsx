"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { ExternalLink, GitBranch, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

export function ProjectsSection({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setActiveIndex(i < 0 ? data.length - 1 : i >= data.length ? 0 : i);
  }, [data.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, goTo]);

  const project = data[activeIndex];

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-24 md:py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="section-label mb-4">
              <span className="w-8 h-px bg-accent inline-block" />
              Portfolio
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-[1.1]">
              Proyek<br />
              <span className="text-accent">Unggulan</span>
            </h2>
          </div>

          {/* Project Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => goTo(activeIndex - 1)}
              className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-sm text-muted-foreground min-w-[60px] text-center">
              {String(activeIndex + 1).padStart(2, "0")} / {String(data.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => goTo(activeIndex + 1)}
              className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Project Showcase (3D Coverflow) */}
        <div className="relative w-full h-[450px] md:h-[500px] mt-8 mb-4 flex items-center justify-center perspective-[1200px]">
          {data.map((project, i) => {
            let offset = i - activeIndex;
            const len = data.length;
            if (offset < -Math.floor(len / 2)) offset += len;
            if (offset > Math.floor(len / 2)) offset -= len;
            
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;

            return (
              <motion.div
                key={project.id}
                className="absolute top-0 w-full max-w-[280px] md:max-w-[340px] h-full bg-background rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col cursor-pointer"
                animate={{
                  x: `${offset * 70}%`,
                  scale: 1 - absOffset * 0.15,
                  zIndex: 30 - absOffset,
                  opacity: absOffset > 1 ? 0 : 1,
                  rotateY: offset * -15,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  if (!isCenter) goTo(i);
                }}
                style={{
                  pointerEvents: absOffset > 1 ? 'none' : 'auto',
                }}
              >
                <ProjectCardInner project={project} isCenter={isCenter} />
              </motion.div>
            );
          })}
        </div>

        {/* Project Thumbnails */}
        {data.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center"
          >
            {data.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                  i === activeIndex
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                {p.title}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectCardInner({ project, isCenter }: { project: any; isCenter: boolean }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const techArray = Array.isArray(project.techStack)
    ? project.techStack
    : typeof project.techStack === 'string'
      ? project.techStack.split(',').map((s: string) => s.trim())
      : [];

  const images = (project.imageUrls && project.imageUrls.length > 0)
    ? project.imageUrls
    : (project.imageUrl ? [project.imageUrl] : []);

  // Reset image index when project changes
  useEffect(() => { setCurrentImageIndex(0); }, [project.id]);

  return (
    <>
      {/* Image Area */}
      <div className="relative w-full aspect-video bg-muted shrink-0 border-b border-border">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            
            {isCenter && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{ opacity: isCenter ? undefined : 0 }}
              >
                <ZoomIn className="w-4 h-4 text-foreground" />
              </button>
            )}

            {isCenter && images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === 0 ? images.length - 1 : i - 1); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i + 1) % images.length); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_: any, idx: number) => (
                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
            <span className="font-mono text-4xl font-bold">{project.title.substring(0,2).toUpperCase()}</span>
            <p className="text-xs mt-2">No Image</p>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 md:p-5 flex flex-col flex-1 overflow-y-auto scrollbar-hide">
        <h3 className="font-serif text-xl md:text-2xl text-foreground mb-2 leading-tight">
          {project.title}
        </h3>

        <div
          className="text-[13px] text-muted-foreground leading-relaxed mb-4 flex-1 prose prose-sm dark:prose-invert max-w-none prose-p:text-muted-foreground prose-a:text-accent prose-strong:text-foreground line-clamp-3"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />

        {/* Tech Stack */}
        {techArray.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {techArray.slice(0, 3).map((tech: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-muted/50 border border-border rounded-md text-[10px] font-medium">
                {tech}
              </span>
            ))}
            {techArray.length > 3 && (
              <span className="px-2 py-1 bg-muted/50 border border-border rounded-md text-[10px] font-medium text-muted-foreground">
                +{techArray.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-border">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary !text-xs !py-2 !px-4 flex-1 justify-center"
              onClick={(e) => { if(!isCenter) e.preventDefault(); }}
              tabIndex={isCenter ? 0 : -1}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary !text-xs !py-2 !px-4 flex-1 justify-center"
              onClick={(e) => { if(!isCenter) e.preventDefault(); }}
              tabIndex={isCenter ? 0 : -1}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Source
            </a>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && images.length > 0 && isCenter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl"
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all"
              onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
            >
              <X className="w-5 h-5" />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[currentImageIndex]}
              alt="Fullscreen"
              className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === 0 ? images.length - 1 : i - 1); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i + 1) % images.length); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Counter */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-muted border border-border">
                  <span className="font-mono text-sm text-muted-foreground">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
