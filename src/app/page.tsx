"use client";

import { motion } from "framer-motion";
import { ArrowRight, LayoutTemplate, Link2, MonitorSmartphone } from "lucide-react";
import Link from "next/link";
import { ProjectsSection } from "@/components/sections/projects";
import { ThemeToggle } from "@/components/theme-toggle";

const DUMMY_PROJECTS = [
  {
    id: 1,
    title: "Minimalist E-Commerce",
    description: "Toko online dengan tipografi rapi dan white space.",
    techStack: "Next.js, TailwindCSS",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Fintech Dashboard",
    description: "Manajemen keuangan dengan grafik interaktif.",
    techStack: "React, D3.js",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Creative Agency",
    description: "Website dengan interaksi halus yang modern.",
    techStack: "Framer Motion",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20 selection:text-accent transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-semibold text-foreground tracking-tight flex items-center gap-2">
            <div className="w-5 h-5 bg-foreground rounded-sm" />
            Portofolio<span className="text-muted-foreground font-normal">Builder</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/admin/login" 
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 max-w-4xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -z-10"
        />
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight"
        >
          Satu tautan untuk <br className="hidden md:block" /> semua karyamu.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Platform pembuatan portofolio khusus untuk developer dan desainer. Fokus pada karya, kami yang urus desain dan hostingnya.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link 
            href="/admin/login" 
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Mulai Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Interactive Demo Area */}
      <section className="py-10">
        <ProjectsSection data={DUMMY_PROJECTS} />
      </section>

      {/* Features Bento */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 bg-card border border-border p-8 rounded-3xl hover:border-accent/50 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <LayoutTemplate className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Desain Siap Pakai</h3>
            <p className="text-muted-foreground">Tidak perlu pusing memikirkan desain. Tampilan portofolio dijamin elegan secara otomatis dengan fitur dark/light mode yang built-in.</p>
          </div>
          
          <div className="col-span-1 bg-card border border-border p-8 rounded-3xl hover:border-accent/50 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Link2 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Custom URL</h3>
            <p className="text-muted-foreground">Klaim username unikmu. Bagikan tautan pendek dan profesional ke semua klien.</p>
          </div>

          <div className="col-span-1 bg-card border border-border p-8 rounded-3xl hover:border-accent/50 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <MonitorSmartphone className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Responsif</h3>
            <p className="text-muted-foreground">Tampil sempurna di HP, tablet, maupun layar desktop resolusi tinggi.</p>
          </div>
          
          <div className="col-span-1 md:col-span-2 bg-foreground text-background p-8 lg:p-12 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Siap memukau dunia?</h3>
              <p className="text-background/80 mb-6 md:mb-0">Setup portofoliomu secara instan.</p>
            </div>
            <Link 
              href="/admin/login" 
              className="bg-background text-foreground border border-transparent px-8 py-4 rounded-xl font-medium hover:bg-background/90 transition-colors shadow-sm whitespace-nowrap"
            >
              Sign up / Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border">
        &copy; {new Date().getFullYear()} PortofolioBuilder.
      </footer>
    </div>
  );
}
