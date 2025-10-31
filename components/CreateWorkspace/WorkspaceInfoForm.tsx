import { CrateWorkspace } from "@/lib/validation/workspaces";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { workspaceTypes } from "@/constants";
import { toCapitalize } from "@/lib/utils/string";

export default function WorkspaceInfoForm({
  form,
  onNext,
}: {
  form: UseFormReturn<CrateWorkspace>;
  onNext: () => void;
}) {
  const onSubmit = async (data: CrateWorkspace) => {
    try {
      // const res = await signIn("credentials", {
      //   redirect: false,
      //   email: data.email,
      //   password: data.password,
      // });
      // console.log(res);
      // if (res?.ok) {
      //   if (res.url) {
      //     // router.push(res.url);
      //   } else {
      //     toast.success("Login successful!");
      //   }
      // } else {
      //   toast.error(res?.error || res?.error || "Invalid credentials");
      // }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      toast.error("Something went wrong! try again later");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 max-w-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Workspace Name</FormLabel>
              <FormControl>
                <Input placeholder="Planora Studio..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {workspaceTypes.map((type) => (
                    <SelectItem value={type} key={type}>
                      {toCapitalize(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Manage projects and team tasks" className="resize-none min-h-10"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Link
            href="/forgot"
            className="text-xs text-primary underline mb-4 block text-end"
          >
            Forgot Password?
          </Link> */}
        <Button
          className="w-full cursor-pointer"
          size="lg"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Continue
        </Button>
      </form>
    </Form>
  );
}
