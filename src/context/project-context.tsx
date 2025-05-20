"use client";

import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

interface ProjectContextData {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
  getProjects: () => Promise<Project[]>;
  loading: boolean;
}

const ProjectContext = React.createContext<ProjectContextData>({} as ProjectContextData);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["targets"] });
    if (selectedProject) {
      localStorage.setItem("selectedProject", JSON.stringify(selectedProject));
    }
  }, [selectedProject]);

  useEffect(() => {
    const local = localStorage.getItem("selectedProject");
    if (local && projects.length > 0) {
      console.log("local", local);
      const index = projects.findIndex((project) => project.id === JSON.parse(local)?.id);
      if (index !== -1) {
        setSelectedProject(projects[index]);
      } else {
        setSelectedProject(projects[0]);
      }
    } else if (projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

  async function getProjects() {
    setLoading(true);
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
      return data;
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProject,
        getProjects,
        loading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProject() {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
