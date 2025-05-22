"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProject } from "@/context/project-context";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  url: z.string().url({ message: "Invalid URL" }),
  method: z.enum(["GET", "POST", "PUT", "DELETE"], {
    errorMap: () => ({ message: "Invalid method" }),
  }),
  checkIntervalMinutes: z.number().min(1).max(60),
});

type FormSchema = z.infer<typeof schema>;

async function saveTarget(data: FormSchema & { projectId: string }) {
  const { projectId, ...targetData } = data;
  const response = await api.post(`/project/${projectId}/target`, targetData);
  return response.data;
}

function Page() {
  const { selectedProject } = useProject();
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: saveTarget,
    onMutate: () => {
      router.push("/dashboard");
    },
    onError(error) {
      toast.error("Error creating target", {
        description: error.message || "Something went wrong",
      });
    },
  });
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
      method: "GET",
      checkIntervalMinutes: 30,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    if (!selectedProject) throw new Error("No project selected");
    mutateAsync({ ...data, projectId: selectedProject.id });
  };

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col">
      <h1 className="font-bold text-xl">New Target</h1>
      <p className="text-muted-foreground mb-4 text-sm">
        Add a new target to monitor. You can choose the URL, HTTP method, and check interval.
      </p>
      <Form {...form}>
        <form className="gap-6 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Method</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkIntervalMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check Interval (minutes)</FormLabel>
                <FormControl className="flex">
                  <div className="flex items-center gap-2">
                    <Slider
                      defaultValue={[field.value]}
                      min={30}
                      max={120}
                      step={5}
                      onValueChange={(value) => field.onChange(value[0])}
                      value={[field.value]}
                    />
                    <span className="whitespace-nowrap flex gap-1 items-end">
                      {field.value}
                      <span className="text-muted-foreground">
                        minute{field.value > 1 ? "s" : ""}
                      </span>
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? "Saving..." : "Save Target"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Page;
