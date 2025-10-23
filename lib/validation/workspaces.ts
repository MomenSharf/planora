import { z } from "zod";

/**
 * Join Workspace Schema
 */
export const joinWorkspace = z.object({
  inviteCode: z.string().min(1, "At least on charactor"),
});

export type JoinWorkspace = z.infer<typeof joinWorkspace>;
