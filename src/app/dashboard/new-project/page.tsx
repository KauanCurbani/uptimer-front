"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProject } from "@/context/project-context";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
});

type FormSchema = z.infer<typeof schema>;

function Page() {
  const router = useRouter();
  const {getProjects} = useProject()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormSchema) => api.post("/projects", data),
    onError(error) {
      toast.error("Error creating project", {
        description: error.message || "Something went wrong",
      });
    },
    onSuccess() {
      toast.success("Project created successfully", {
        description: "Your project has been created",
      });
      router.push(`/dashboard`);
    },
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    await mutateAsync(data);
    await getProjects();
  };

  return (
    <div className="flex justify-center items-center min-h-dvh bg-background">
      <Card className="min-w-lg">
        <CardHeader>
          <CardTitle>New Project</CardTitle>
          <CardDescription>Create a new project</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Project Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled={isPending} type="submit" onClick={form.handleSubmit(onSubmit)}>
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Page;
