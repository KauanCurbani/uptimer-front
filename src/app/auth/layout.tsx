"use client";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    if (isAuthenticated) router.push("/dashboard");
  }, [loading, isAuthenticated]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

export default Layout;
