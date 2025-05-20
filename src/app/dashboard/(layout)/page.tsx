"use client";

import { useProject } from "@/context/project-context";
import { useQuery } from "@tanstack/react-query";
import { getTargets } from "./_components/actions/get-target";
import TargetDisplay from "./_components/target-display";

export interface Log {
  id: string;
  timestamp: Date;
  statusCode: number;
  isUp: boolean;
  responseTimeMs: number;
  errorMessage: string | null;
  targetId: string;
}

export interface Target {
  id: string;
  url: string;
  method: string;
  checkIntervalMinutes: number;
  lastStatusCode: number;
  lastIsUp: boolean;
  lastCheckedAt: Date;
  createdAt: Date;
}



function Page() {
  const { selectedProject } = useProject();
  const { data: targets } = useQuery({
    queryKey: ["targets"],
    queryFn: () => getTargets(selectedProject),
  });

  // const { data, error } = useQuery({
  //   queryKey: ["logs"],
  //   queryFn: () => getLogs("targetId"), // Replace with actual targetId
  // });

  return (
    <div className="flex flex-col gap-4">
      {targets?.map((target) => <TargetDisplay key={target.id} target={target} />)}
    </div>
  );
}

export default Page;
