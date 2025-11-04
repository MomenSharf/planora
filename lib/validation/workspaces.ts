import { workspaceTypes } from "@/constants";
import { z } from "zod";

/**
 * Join Workspace Schema
 */
export const joinWorkspace = z.object({
  inviteCode: z.string().min(1, "At least on charactor"),
});

export type JoinWorkspace = z.infer<typeof joinWorkspace>;

export const crateWorkspaceSchema = z.object({
  name: z.string().min(3, "At least one character"),
  description: z.string().min(10, "At least 10 character"),
  type: z.enum([...workspaceTypes], {
    message: "Please select a workspace type",
  }),
  invitationEmails: z.array(z.string().email("invalid mail address")),
});

export type CrateWorkspaceSchema = z.infer<typeof crateWorkspaceSchema>;
