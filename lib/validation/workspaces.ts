import { workspaceTypes } from "@/constants";
import { z } from "zod";

/**
 * Join Workspace Schema
 */
export const joinWorkspace = z.object({
  inviteCode: z.string().min(1, "At least on charactor"),
});

export type JoinWorkspace = z.infer<typeof joinWorkspace>;

export const crateWorkspace = z.object({
  name: z.string().min(3, "At least on charactor"),
  description: z.string().min(15, "At least on charactor"),
  type: z.enum([...workspaceTypes]),
  invitationEmails: z.array(z.string().email()),
});

export type CrateWorkspace = z.infer<typeof crateWorkspace>;
