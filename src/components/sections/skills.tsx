"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SkillsSection({ data }: { data: any[] }) {
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

  const category = data[activeIndex];

  return (
    <section id="skills" ref={ref} className="relative py-24 md:py-32 px-6">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-muted/30 -z-10" />

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
              Kompetensi
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-[1.1]">
              Keahlian &<br />
              <span className="text-accent">Kemampuan</span>
            </h2>
          </div>

          {/* Navigation */}
          {data.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => goTo(activeIndex - 1)}
                className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
                aria-label="Previous category"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-mono text-sm text-muted-foreground min-w-[60px] text-center">
                {String(activeIndex + 1).padStart(2, "0")} / {String(data.length).padStart(2, "0")}
              </span>
              <button
                onClick={() => goTo(activeIndex + 1)}
                className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
                aria-label="Next category"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Skill Category Showcase (3D Coverflow) */}
        <div className="relative w-full h-[320px] md:h-[360px] mt-8 mb-6 flex items-center justify-center perspective-[1200px]">
          {data.map((category, i) => {
            let offset = i - activeIndex;
            const len = data.length;
            // Circular offset calculation
            if (offset < -Math.floor(len / 2)) offset += len;
            if (offset > Math.floor(len / 2)) offset -= len;
            
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;

            return (
              <motion.div
                key={category.id}
                className="absolute top-0 w-full max-w-[260px] md:max-w-[300px] h-full bg-background rounded-2xl border border-border shadow-2xl p-5 md:p-6 flex flex-col cursor-pointer"
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
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-base text-accent font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-6 h-px bg-border" />
                  <h4 className="font-serif text-xl md:text-2xl text-foreground">
                    {category.name || category.categoryName}
                  </h4>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 overflow-y-auto pr-1 scrollbar-hide flex-1 items-start content-start">
                  {category.skills?.map((skill: any) => (
                    <span key={skill.id} className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-[13px] font-medium text-foreground hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300">
                      {skill.name || skill.skillName}
                    </span>
                  ))}
                  {(!category.skills || category.skills.length === 0) && (
                    <p className="text-muted-foreground text-[13px]">Belum ada keahlian di kategori ini.</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Thumbnails */}
        {data.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center"
          >
            {data.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                  i === activeIndex
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                }`}
              >
                {cat.name || cat.categoryName}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
