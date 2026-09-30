"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, AlertCircle, Mail, Phone, MapPin, Send } from "lucide-react";

export function ContactSection({ data }: { data: any }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(
        `/api/portfolio/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error();
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: data?.contactEmail,
      href: data?.contactEmail ? `mailto:${data.contactEmail}` : undefined,
    },
    {
      icon: Phone,
      label: "WhatsApp",
      value: data?.contactPhone,
      href: data?.contactPhone ? `https://wa.me/${data.contactPhone.replace(/\D/g, '').replace(/^0/, '62')}` : undefined,
    },
    {
      icon: MapPin,
      label: "Lokasi",
      value: data?.contactLocation,
    },
  ].filter((item) => item.value);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 md:py-32 px-6"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30 -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="section-label justify-center mb-4">
            <span className="w-8 h-px bg-accent inline-block" />
            Kontak
            <span className="w-8 h-px bg-accent inline-block" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-[1.1] mb-6">
            Mari <span className="text-accent">Berkolaborasi</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tertarik bekerja sama atau memiliki pertanyaan? Jangan ragu untuk menghubungi saya.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="p-8 rounded-2xl border border-border bg-background space-y-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full border border-border bg-muted flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-1">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-base font-medium text-foreground hover:text-accent transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-base font-medium text-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 rounded-2xl border border-border bg-accent/5">
              <p className="text-sm text-foreground/80 leading-relaxed">
                Saya selalu terbuka untuk diskusi tentang peluang baru, proyek kolaboratif, atau sekadar menyapa. Respons biasanya dalam 24 jam.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="p-8 md:p-10 rounded-2xl border border-border bg-background">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-3"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:bg-background transition-all"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-3"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:bg-background transition-all"
                      placeholder="john@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-3"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:bg-background transition-all resize-none"
                    placeholder="Ceritakan proyek atau pertanyaan Anda..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full !py-4"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" strokeWidth={1.5} />
                      Kirim Pesan
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 mt-4"
                  >
                    <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                    <p className="text-sm text-accent font-medium">
                      Pesan berhasil dikirim! Saya akan segera merespons.
                    </p>
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mt-4"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-500 font-medium">
                      Gagal mengirim pesan. Silakan coba lagi.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
