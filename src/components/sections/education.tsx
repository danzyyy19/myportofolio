"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Award } from "lucide-react";

export function EducationSection({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="education" ref={ref} className="relative py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="section-label mb-4">
            <span className="w-8 h-px bg-accent inline-block" />
            Pendidikan
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-[1.1]">
            Edukasi &<br />
            <span className="text-accent">Sertifikasi</span>
          </h2>
        </motion.div>

        {/* Education Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl border border-border bg-background hover:border-accent/40 transition-all duration-500 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl border border-border bg-muted flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:border-accent transition-colors duration-300">
                  {edu.type === 'certification' ? (
                    <Award className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                  ) : (
                    <GraduationCap className="w-6 h-6 text-muted-foreground group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                  )}
                </div>
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-3">
                    {edu.period}
                  </span>
                  <h3 className="font-serif text-2xl text-foreground">
                    {edu.institution}
                  </h3>
                </div>
              </div>

              {/* Degree / Major */}
              <p className="text-lg text-foreground font-medium mb-1">
                {edu.degree || edu.major}
              </p>

              {edu.location && (
                <p className="font-mono text-[11px] text-muted-foreground tracking-wider mb-6">
                  {edu.location}
                </p>
              )}

              {/* Description / Notes */}
              {(edu.description || edu.notes) && (
                <div className="mt-auto pt-6 border-t border-border">
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: edu.description || edu.notes }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
