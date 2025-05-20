"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.push("/auth/login");
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="">Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
