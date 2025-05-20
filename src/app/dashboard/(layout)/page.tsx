"use client";
import { useProject } from "@/context/project-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Page() {
  const router = useRouter();
  const { loading, projects, getProjects, selectedProject, setSelectedProject } = useProject();

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (projects.length === 0) router.push("/dashboard/new-project");
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [loading, projects, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="">Loading...</div>
      </div>
    );
  }

  return <div>{JSON.stringify(projects, null, 2)}</div>;
}

export default Page;
