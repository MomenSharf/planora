import { workspaceTypes } from "@/constants";
import { toCapitalize } from "@/lib/utils/string";
import { CrateWorkspaceSchema } from "@/lib/validation/workspaces";
import { ChevronRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export default function WorkspaceInfoForm({
  form,
  onNext,
}: {
  form: UseFormReturn<CrateWorkspaceSchema>;
  onNext: () => void;
}) {
  const handleNext = async () => {
    const isValid = await form.trigger(["name", "type", "description"], {
      shouldFocus: true,
    }); // validate these fields only
    if (isValid) onNext();
  };

  return (
    <div className="flex flex-col gap-3 sm:p-6">
      <div>
        <h1 className="text-2xl font-extrabold">Create Your Workspace</h1>
        <p className="text-muted-foreground text-sm">
          Organize your team, projects, and goals — all in one shared space.
        </p>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
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
        name="type"
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
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Manage projects and team tasks..."
                className="resize-none h-24"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end mt-4">
        <Button size="lg" type="button" onClick={handleNext}>
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
