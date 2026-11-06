import { z } from "zod";

export const STATUSES = ["replaced", "partial", "augmented", "not-yet"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  replaced: "Replaced",
  partial: "Partially replaced",
  augmented: "Augmented",
  "not-yet": "Not yet",
};

/** One-line definitions. Shown on /methodology. Keep in sync with CONTRIBUTING.md. */
export const STATUS_DEFINITION: Record<Status, string> = {
  replaced:
    "AI performs the core work of this occupation end to end, and employers have stopped hiring humans for it at meaningful scale.",
  partial:
    "AI performs a large share of the tasks, and demand for human workers has measurably fallen, but humans still do part of the job.",
  augmented:
    "AI is in common use, but it mainly makes human workers faster. Headcount has not fallen because of it.",
  "not-yet":
    "No credible evidence of AI doing the core work of this occupation today.",
};

export const CONFIDENCE = ["low", "medium", "high"] as const;

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase kebab-case");

export const SourceSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
});

export const AiToolSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  url: z.url(),
});

export const TaskSchema = z.object({
  task: z.string().min(1),
  status: z.enum(STATUSES),
  tool: z.string().optional(),
  sourceUrl: z.url().optional(),
});

export const OccupationSchema = z.object({
  /** Must equal the file name without `.json`. */
  slug,
  title: z.string().min(1),
  sector: z.string().min(1),
  status: z.enum(STATUSES),
  summary: z.string().min(1).max(200),
  /** 0-100, or null when unknown. */
  tasksAutomatedPct: z.number().min(0).max(100).nullable(),
  /** Four-digit year, or null when unknown. */
  yearReplaced: z.number().int().min(1950).max(2100).nullable(),
  confidence: z.enum(CONFIDENCE),
  /** YYYY-MM-DD */
  updatedAt: z.iso.date(),
  /** true = placeholder or unverified. The page shows a draft banner. */
  draft: z.boolean().default(false),
  aiTools: z.array(AiToolSchema),
  tasks: z.array(TaskSchema),
  /** Plain-text prose. Separate paragraphs with a blank line. */
  evidence: z.string().min(1),
  /** Every occupation needs at least one source. */
  sources: z.array(SourceSchema).min(1),
});

export type Occupation = z.infer<typeof OccupationSchema>;
