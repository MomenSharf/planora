"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { GetWorkspaceByIdType } from "@/types/workspace";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Fetch a workspace and its related entities by ID.
 * Requires the user to be authenticated.
 */
export async function getWorkspaceById(
  workspaceId: string
): Promise<
  | { success: true; data: GetWorkspaceByIdType }
  | { success: false; error: string }
> {
  try {
    const session = await getCurrentUser();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized. Please sign in to continue.",
      };
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id
      }, 
      include: {
        
      }
    })

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId, },
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

    // Revalidate workspace path for ISR
    revalidatePath(`/${workspaceId}`);

    return {
      success: true,
      data: workspace,
    };
  } catch (error) {
    console.error("❌ Error fetching workspace:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed. Please check your inputs.",
      };
    }

    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed")
    ) {
      return {
        success: false,
        error: "A workspace with this name already exists.",
      };
    }

    return {
      success: false,
      error:
        "Something went wrong while fetching the workspace. Please try again.",
    };
  }
}
