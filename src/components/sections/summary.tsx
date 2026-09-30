"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function SummarySection({ data, stats }: { data: any, stats?: any }) {
  if (!data) return null;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const statItems = [
    { value: stats?.experience || "0", label: "Tahun Pengalaman" },
    { value: stats?.categoriesCount || "0", label: "Kategori Keahlian" },
    { value: stats?.projectsCount || "0", label: "Proyek Selesai" },
  ];

  return (
    <section
      id="summary"
      ref={ref}
      className="relative py-24 md:py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <div className="section-label mb-4">
              <span className="w-8 h-px bg-accent inline-block" />
              Tentang Saya
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-[1.1] mb-8">
              Ringkasan<br />
              <span className="text-accent">Profesional</span>
            </h2>

            {/* Stats */}
            <div className="space-y-6">
              {statItems.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-baseline gap-4"
                >
                  <span className="font-mono text-4xl font-bold text-accent tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column — Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="border-l-2 border-accent/20 pl-8 md:pl-12">
              <div
                className="text-base md:text-lg leading-[1.8] text-muted-foreground prose prose-base dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:mb-6 prose-a:text-accent prose-strong:text-foreground prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
