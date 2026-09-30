"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300"
    >
      <LogOut className="w-4 h-4" strokeWidth={1.5} />
      Sign Out
    </button>
  );
}
