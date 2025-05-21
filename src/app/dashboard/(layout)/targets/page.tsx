"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useProject } from "@/context/project-context";
import { useQuery } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { getTargets } from "../_components/actions/get-target";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function Page() {
  const { selectedProject } = useProject();
  const { data, error, isPending } = useQuery({
    queryKey: ["targets"],
    queryFn: () => getTargets(selectedProject),
  });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 w-full">
      {
        isPending && new Array(3).fill(0).map((_, index) => (<Skeleton className="h-32 flex-1 rounded" />))
      }
      {data &&
        data.map((target) => (
          <Card key={target.id} className="w-full h-full">
            <CardContent>
              <Label className="text-lg font-bold truncate overflow-ellipsis">{target.url}</Label>
              <span className="text-sm text-muted-foreground">
                Last checked:{" "}
                {target.lastCheckedAt ? new Date(target.lastCheckedAt).toLocaleString() : "Never"}
              </span>
            </CardContent>
          </Card>
        ))}
      <Link href="/dashboard/targets/new" className="rounded-xl border w-full min-h-24 border-dashed flex items-center justify-center hover:brightness-90">
        <PlusCircleIcon className="text-border" size={32} />
      </Link>
    </div>
  );
}

export default Page;
