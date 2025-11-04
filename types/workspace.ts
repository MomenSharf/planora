import { Prisma } from "@prisma/client";

export type GetWorkspaceByIdType = Prisma.WorkspaceGetPayload<{
  include: {
    projects: true;
    memberships: true;
    Label: true;
    Team: true;
  };
}>;
