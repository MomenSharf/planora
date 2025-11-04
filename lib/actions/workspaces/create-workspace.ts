// app/actions/get-workspace-by-id.ts
"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { GetWorkspaceByIdType } from "@/types/workspace";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- Types ---
export type GetWorkspaceByIdReturn =
  | { success: true; data: GetWorkspaceByIdType }
  | { success: false; error: string };

// --- Action ---
export async function getWorkspaceById(
  workspaceId: string
): Promise<GetWorkspaceByIdReturn> {
  try {
    const session = await getCurrentUser();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized. Please sign in to continue.",
      };
    }

    // Fetch workspace with all related entities
    const workspace = await db.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        projects: true,
        memberships: true,
        Label: true,
        Team: true,
      },
    });

    // Handle missing workspace
    if (!workspace) {
      return {
        success: false,
        error: "Workspace not found.",
      };
    }

    // Revalidate workspace page
    revalidatePath(`/${workspaceId}`);

    return {
      success: true,
      data: workspace,
    };
  } catch (error) {
    console.error("❌ Error fetching workspace:", error);

    // Handle known validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed. Please check your inputs.",
      };
    }

    // Handle Prisma unique constraint error (edge case)
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed")
    ) {
      return {
        success: false,
        error: "A workspace with this name already exists.",
      };
    }

    // Catch-all fallback
    return {
      success: false,
      error:
        "Something went wrong while fetching the workspace. Please try again.",
    };
  }
}
