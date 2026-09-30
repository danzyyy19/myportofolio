"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, Trash2, CheckCircle, Search, Inbox, MailOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
const getSession = async () => (await authClient.getSession()).data;

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;
      
      const res = await fetch(`/api/admin/messages`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;
      
      const res = await fetch(`/api/admin/messages/${id}/read`, {
        method: "PUT",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Hapus pesan ini secara permanen?")) return;
    
    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;
      
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) || 
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
            <Inbox className="w-8 h-8 text-accent" />
            Pesan Masuk
          </h1>
          <p className="text-muted-foreground">Kelola pesan dari pengunjung website Anda.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-background/50 border border-border rounded-xl px-4 py-2 shrink-0">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full sm:w-48"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Mail className="w-4 h-4 text-accent" />
          <span>Semua Pesan: <span className="text-foreground">{messages.length}</span></span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>Belum Dibaca: <span className="text-accent">{unreadCount}</span></span>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="glass-card !p-12 text-center flex flex-col items-center">
            <MailOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Tidak ada pesan yang ditemukan.</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredMessages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-card relative overflow-hidden transition-all ${!msg.isRead ? 'border-accent/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]' : ''}`}
              >
                {!msg.isRead && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-foreground flex items-center gap-2">
                        {msg.name}
                        {!msg.isRead && <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] uppercase tracking-wider font-bold">Baru</span>}
                      </h3>
                      <span className="text-xs text-muted-foreground font-mono-ui">
                        {new Date(msg.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <a href={`mailto:${msg.email}`} className="text-sm text-accent hover:underline mb-4 inline-block">
                      {msg.email}
                    </a>
                    
                    <div className="p-4 rounded-xl bg-background/40 border border-border text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 justify-end sm:justify-start">
                    {!msg.isRead && (
                      <button
                        onClick={() => markAsRead(msg.id)}
                        className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors"
                        title="Tandai sudah dibaca"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      title="Hapus pesan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
