"use client";

import { api } from "@/lib/api";
import React from "react";

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

interface ProjectContextData {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
  getProjects: () => Promise<void>;
  loading: boolean;
}

const ProjectContext = React.createContext<ProjectContextData>({} as ProjectContextData);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);

  async function getProjects() {
    setLoading(true);
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
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
