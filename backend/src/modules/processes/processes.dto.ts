import { ProcessImportance, ProcessKind, ProcessStatus } from "@prisma/client";
import { z } from "zod";

export const areaParamsSchema = z.object({
  areaId: z.string().cuid(),
});

export const processParamsSchema = z.object({
  id: z.string().cuid(),
});

export const processRelatedParamsSchema = z.object({
  id: z.string().cuid(),
  relatedId: z.string().cuid().optional(),
});

export const createProcessSchema = z.object({
  parentId: z.string().cuid().optional().nullable(),
  name: z.string().min(1).max(150),
  description: z.string().max(5000).optional(),
  kind: z.nativeEnum(ProcessKind).optional(),
  status: z.nativeEnum(ProcessStatus).optional(),
  importance: z.nativeEnum(ProcessImportance).optional(),
});

export const updateProcessSchema = createProcessSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Informe ao menos um campo para atualização",
  },
);

export const linkToolSchema = z
  .object({
    toolId: z.string().cuid().optional(),
    name: z.string().min(1).optional(),
    url: z.string().url().optional(),
  })
  .refine((data) => data.toolId || data.name, {
    message: "Informe toolId ou name",
  });

export const linkPersonSchema = z
  .object({
    personId: z.string().cuid().optional(),
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
  })
  .refine((data) => data.personId || data.name, {
    message: "Informe personId ou name",
  });

export const linkDocumentSchema = z
  .object({
    documentId: z.string().cuid().optional(),
    title: z.string().min(1).optional(),
    type: z.enum(["URL", "FILE"]).optional(),
    url: z.string().url().optional(),
    storageKey: z.string().optional(),
    mimeType: z.string().optional(),
    sizeBytes: z.number().int().nonnegative().optional(),
  })
  .refine((data) => data.documentId || data.title, {
    message: "Informe documentId ou title",
  });

export type CreateProcessInput = z.infer<typeof createProcessSchema>;
export type UpdateProcessInput = z.infer<typeof updateProcessSchema>;
export type LinkToolInput = z.infer<typeof linkToolSchema>;
export type LinkPersonInput = z.infer<typeof linkPersonSchema>;
export type LinkDocumentInput = z.infer<typeof linkDocumentSchema>;
