"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { useProject } from "@/context/project-context";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const {
    loading: projectLoading,
    projects,
    getProjects,
  } = useProject();

  useEffect(() => {
    if (loading) return;
    getProjects();
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    if (projectLoading) return;
    if (projects.length === 0) router.push("/dashboard/new-project");
  }, [projectLoading, projects, loading]);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.push("/auth/login");
  }, [loading, isAuthenticated, router]);

  if (loading || projectLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="">Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex gap-4 items-center p-4">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              {pathname.split("/").map((segment, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>{segment}</BreadcrumbItem>
                  {index < pathname.split("/").length - 1 && (
                    <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="p-6 w-full">{children}</div>
      </main>
    </SidebarProvider>
  );
}
