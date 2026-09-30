"use client";

import { motion } from "framer-motion";
import { ArrowDown, MapPin, Download, Mail } from "lucide-react";
import Image from "next/image";

export function HeroSection({ data }: { data: any }) {
  if (!data) return null;

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSummary = () => {
    const el = document.getElementById("summary");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-24 pb-12 sm:pb-0"
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Subtle gradient orb — single, understated */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <div className="order-2 lg:order-1">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[11px] text-accent font-medium tracking-wide">
                Open for opportunities
              </span>
            </motion.div>

            {/* Location */}
            {data.contactLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-2 mb-5"
              >
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                <span className="font-mono text-[11px] text-muted-foreground tracking-wider uppercase">
                  {data.contactLocation}
                </span>
              </motion.div>
            )}

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif text-foreground leading-[0.95] tracking-[-0.03em] mb-6"
            >
              {data.heroName}
            </motion.h1>

            {/* Role */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-md mb-10"
            >
              {data.heroRole}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href={data.cvFileUrl || '#'}
                className="btn-primary"
              >
                <Download className="w-4 h-4" strokeWidth={1.5} />
                Download CV
              </a>

              <button
                onClick={scrollToContact}
                className="btn-secondary"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                Hubungi Saya
              </button>
            </motion.div>
          </div>

          {/* Right: Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Single subtle ring */}
              <div className="absolute -inset-3 rounded-2xl border border-border/40" />

              {/* Photo Container */}
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[420px] rounded-2xl overflow-hidden">
                <Image
                  src={data.profileImageUrl || "/profile.jpg"}
                  alt={data.heroName || "Profile Photo"}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                />
                {/* Subtle bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/30 to-transparent" />
              </div>

              {/* Floating Stats Card */}
              {(data.heroStat1Value || data.heroStat1Label) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -bottom-4 -left-4 sm:-left-6 bg-background border border-border rounded-xl px-4 py-3 shadow-sm"
                >
                  <div className="font-mono text-2xl font-bold text-accent">{data.heroStat1Value || "3+"}</div>
                  <div className="text-[11px] text-muted-foreground">{data.heroStat1Label || "Tahun Pengalaman"}</div>
                </motion.div>
              )}

              {/* Floating Tech Card */}
              {(data.heroStat2Value || data.heroStat2Label) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute -top-2 -right-4 sm:-right-6 bg-background border border-border rounded-xl px-4 py-3 shadow-sm"
                >
                  <div className="font-mono text-2xl font-bold text-warm">{data.heroStat2Value || "IT"}</div>
                  <div className="text-[11px] text-muted-foreground">{data.heroStat2Label || "& Administrasi"}</div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToSummary}
        >
          <span className="font-mono text-[10px] text-muted-foreground/60 tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-muted-foreground/40" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
