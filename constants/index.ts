export const workspaceTypes = [
  "personal", // single user, private tasks & notes
  "team", // small cross-functional team
  "product", // product-focused workspace (roadmaps, backlog)
  "engineering", // engineering / dev-centric (repos, sprints)
  "marketing", // campaigns, content calendar
  "design", // design files, feedback loops
  "sales", // deals, pipelines, quotas
  "HR", // hiring, onboarding, people ops
  "education", // courses, lessons, student work
  "agency", // multiple client projects under one org
  "other",
] as const;

export type WorkspaceType = (typeof workspaceTypes)[number];
