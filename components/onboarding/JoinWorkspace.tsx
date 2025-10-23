"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  JoinWorkspace as joinWorkspaceSchema,
  joinWorkspace,
} from "@/lib/validation/workspaces";

export default function JoinWorkspace() {
  const form = useForm<joinWorkspaceSchema>({
    resolver: zodResolver(joinWorkspace),
    defaultValues: {
      inviteCode: "",
    },
  });

  const onSubmit = () => {};
  return (
    <div className="flex gap-3 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-1 w-full"
        >
          <FormField
            control={form.control}
            name="inviteCode"
            render={({ field }) => (
              <FormItem className="mb-4 w-full">
                <FormControl>
                  <Input className='h-10' placeholder="Jion by invition code" {...field} disabled={form.formState.isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="cursor-pointer"
            size="lg"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Join
          </Button>
        </form>
      </Form>
    </div>
  );
}
