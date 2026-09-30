"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase } from "lucide-react";

export function ExperienceSection({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref} className="relative py-24 md:py-32 px-6">
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
            Karir
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-[1.1]">
            Riwayat<br />
            <span className="text-accent">Pekerjaan</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[7px] md:left-[11px] top-4 bottom-4 w-px bg-border" />

          <div className="space-y-12">
            {data.map((company, companyIndex) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: companyIndex * 0.12 }}
                className="relative pl-10 md:pl-14"
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-0 top-1">
                  <div className="w-[15px] h-[15px] md:w-[23px] md:h-[23px] rounded-full border-2 border-accent bg-background flex items-center justify-center">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent" />
                  </div>
                </div>

                {/* Company Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                    {company.companyName || company.name}
                  </h3>
                  {company.location && (
                    <span className="font-mono text-[11px] text-muted-foreground tracking-wider">
                      {company.location}
                    </span>
                  )}
                </div>

                {/* Roles */}
                <div className="space-y-6">
                  {(company.roles || company.experiences)?.map((role: any, roleIndex: number) => (
                    <div
                      key={role.id}
                      className={`${roleIndex > 0 ? "pt-6 border-t border-border" : ""}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h4 className="text-base font-semibold text-foreground">
                          {role.title || role.jobTitle}
                        </h4>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/8 font-mono text-[11px] text-accent font-medium whitespace-nowrap">
                          {role.period}
                        </span>
                      </div>

                      {role.description && (
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: role.description }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
