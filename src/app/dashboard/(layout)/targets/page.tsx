"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useProject } from "@/context/project-context";
import { useQuery } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { getTargets } from "../_components/actions/get-target";

function Page() {
  const { selectedProject } = useProject();
  const { data, error } = useQuery({
    queryKey: ["targets"],
    queryFn: () => getTargets(selectedProject),
  });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
      {data &&
        data.map((target) => (
          <Card key={target.id} className="w-full h-full">
            <CardContent>
              <Label className="text-lg font-bold">{target.url}</Label>
              <span className="text-sm text-muted-foreground">
                Last checked:{" "}
                {target.lastCheckedAt ? new Date(target.lastCheckedAt).toLocaleString() : "Never"}
              </span>
            </CardContent>
          </Card>
        ))}
      <div className="rounded-xl border w-full min-h-24 border-dashed flex items-center justify-center hover:brightness-90">
        <PlusCircleIcon className="text-border" size={32} />
      </div>
    </div>
  );
}

export default Page;
