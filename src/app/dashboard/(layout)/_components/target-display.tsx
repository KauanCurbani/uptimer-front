"use client";

import React, { useEffect } from "react";
import { Log, Target } from "../page";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SIZE = 35;

async function getLogs(targetId: string): Promise<Log[]> {
  const { data } = await api.get(`/${targetId}/logs`, {
    params: {
      limit: SIZE,
    },
  });
  return data;
}

function TargetDisplay({ target }: { target: Target }) {
  const [average, setAverage] = React.useState(0);
  const { data, isFetching } = useQuery({
    queryKey: ["logs", target.id],
    queryFn: () => getLogs(target.id),
  });
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: ["logs", target.id],
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [queryClient, target.id]);

  useEffect(() => {
    if (data) {
      const total = data.reduce((acc, log) => acc + log.responseTimeMs, 0);
      const avg = total / data.length;
      setAverage(avg);
    }
  }, [data]);

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-md">{target.url}</h2>
          <div className="flex gap-2">
            <span
              className={cn(
                "text-sm font-medium px-1 rounded-lg",
                target.lastIsUp ? "text-green-700 bg-green-500/10" : "text-red-700 *:bg-red-500/10 "
              )}
            >
              {target.lastIsUp ? "UP" : "DOWN"}
            </span>
            <span
              className={cn(
                "text-sm font-medium px-1 rounded-lg",
                target.lastIsUp ? "text-green-700 bg-green-500/10" : "text-red-700 *:bg-red-500/10 "
              )}
            >
              {average.toFixed(2)} ms
            </span>
          </div>
        </div>
        <div className="flex w-full gap-1">
          {isFetching && <Skeleton className="h-12 flex-1 rounded" />}
          {SIZE - (data?.length || 0) > 0 &&
            Array.from({ length: SIZE - (data?.length || 0) }, (_, i) => (
              <Skeleton key={i} className="h-12 flex-1" />
            ))}
          {!isFetching &&
            data?.map((log) => {
              return (
                <Tooltip key={log.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn("h-12 flex-1 bg-red-500 rounded", log.isUp && "bg-green-500")}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="p-2">
                      <p className="font-bold text-md">{log.isUp ? "UP" : "DOWN"}</p>
                      <p className="text-sm ">{new Date(log.timestamp).toLocaleString("pt-BR")}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}

export default TargetDisplay;
