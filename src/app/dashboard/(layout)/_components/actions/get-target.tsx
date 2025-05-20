"use client";
import { Project } from "@/context/project-context";
import { Target } from "../../page";
import { api } from "@/lib/api";

export const getTargets = async (selectedProject?: Project | null): Promise<Target[]> => {
  if (!selectedProject) {
    throw new Error("No project selected");
  }

  const { data } = await api.get(`/project/${selectedProject.id}/target`);
  console.log(data);
  return data;
};