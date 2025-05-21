"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, AlertTriangleIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { Log, Target } from "../page";

async function getLogs(targetId: string, size: number): Promise<Log[]> {
  const { data } = await api.get(`/${targetId}/logs`, {
    params: {
      limit: size,
    },
  });
  return data;
}

function TargetDisplay({ target }: { target: Target }) {
  const SIZE = document.documentElement.clientWidth < 640 ? 20 : 33;
  const [average, setAverage] = React.useState(0);
  const { data, isFetching } = useQuery({
    queryKey: ["logs", target.id],
    queryFn: () => getLogs(target.id, SIZE),
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (data) {
      const total = data.reduce((acc, log) => acc + log.responseTimeMs, 0);
      const avg = total / data.length;
      setAverage(avg);
    }
  }, [data]);

  const errors = data?.filter((log) => log.errorMessage).splice(0, 2);
  const maxLatency = Math.max(...(data?.map((log) => log.responseTimeMs) || []));
  const minLatency = Math.min(...(data?.map((log) => log.responseTimeMs) || []));

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <Link
            href={target.url}
            target="_blank"
            className="text-md md:text-lg truncate flex underline items-center"
          >
            {target.url}
            <ExternalLinkIcon className="size-4 ml-1" />
          </Link>
          <div className="flex gap-2">
            <span
              className={cn(
                "text-sm font-medium px-2 rounded-lg",
                target.lastIsUp ? "text-green-700 bg-green-500/10" : "text-red-700 bg-red-500/10"
              )}
            >
              {target.lastIsUp ? "UP" : "DOWN"}
            </span>
            <span
              className={cn(
                "text-sm font-medium px-2 rounded-lg whitespace-nowrap",
                target.lastIsUp
                  ? "text-green-700 bg-green-500/10"
                  : "text-red-700   bg-red-500/10 ",
                average > 500 && "text-yellow-700 bg-yellow-500/10"
              )}
            >
              {average.toFixed(2)} ms
            </span>
          </div>
        </div>
        <div className="flex w-full gap-1 mt-3">
          {isFetching && <Skeleton className="h-12 flex-1 rounded" />}
          {SIZE - (data?.length || 0) > 0 &&
            Array.from({ length: SIZE - (data?.length || 0) }, (_, i) => (
              <Skeleton key={i} className="h-12 flex-1  rounded-sm" />
            ))}
          {!isFetching &&
            data
              ?.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((log) => {
                const percentage = maxLatency === 0 ? 0 : (log.responseTimeMs / maxLatency) * 50;

                return (
                  <Tooltip key={log.id}>
                    <TooltipTrigger asChild>
                      <div className="h-12 flex-1 flex items-end">
                        <div
                          style={{
                            height: `${50 + percentage}%`,
                            minHeight: "50%",
                          }}
                          className={cn(
                            "flex-1 bg-red-500 rounded-sm",
                            log.isUp && "bg-green-500",
                            log.isUp && log.responseTimeMs > 500 && "bg-yellow-500"
                          )}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-2">
                        <p className="font-bold text-sm">
                          {log.statusCode ?? "Unknown"} - {log.isUp ? "UP" : "DOWN"}
                        </p>
                        <p className="text-xs">{new Date(log.timestamp).toLocaleString("pt-BR")}</p>
                        <p className="text-xs flex items-center gap-1">
                          {log.responseTimeMs > 500 && <AlertTriangleIcon className="size-3" />}{" "}
                          {log.responseTimeMs ?? "--"}
                          ms
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
        </div>
        <div className="mt-4 flex justify-between flex-wrap gap-1">
          <Label className="text-muted-foreground">
            Last checked:{" "}
            {target.lastCheckedAt
              ? new Date(target.lastCheckedAt).toLocaleString("pt-BR")
              : "Unknown"}
          </Label>

          <Label className="text-muted-foreground">
            Last status code: {target.lastStatusCode ? target.lastStatusCode : "Unknown"}
          </Label>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          {errors &&
            errors.map((log) => (
              <Alert key={log.id} variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>
                  [{new Date(log.timestamp).toLocaleString("pt-BR")}] {log.errorMessage}
                </AlertTitle>
              </Alert>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TargetDisplay;
