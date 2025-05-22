"use client";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.push("/auth/login");
  }, [loading, isAuthenticated]);

  return <>{children}</>;
}

export default Layout;
