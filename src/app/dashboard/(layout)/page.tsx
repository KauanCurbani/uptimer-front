"use client";

import { useProject } from "@/context/project-context";
import { useQuery } from "@tanstack/react-query";
import { getTargets } from "./_components/actions/get-target";
import TargetDisplay from "./_components/target-display";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data: targets, isPending } = useQuery({
    queryKey: ["targets"],
    queryFn: () => getTargets(selectedProject),
    refetchInterval: 60000,
  });

  return (
    <div className="flex flex-col gap-4">
      {targets?.length === 0 && (
        <div className="text-center text-muted-foreground">
          No targets found. Create a new target to get started.
        </div>
      )}
      {isPending &&
        !targets &&
        new Array(3)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="h-44 mx-auto w-full max-w-2xl rounded" />
          ))}
      {targets?.map((target) => (
        <TargetDisplay key={target.id} target={target} />
      ))}
    </div>
  );
}

export default Page;
