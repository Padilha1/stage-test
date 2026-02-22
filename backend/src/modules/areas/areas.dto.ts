import { z } from "zod";

export const areaParamsSchema = z.object({
  id: z.string().cuid(),
});

export const createAreaSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(5000).optional(),
});

export const updateAreaSchema = createAreaSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Informe ao menos um campo para atualização",
  },
);

export type CreateAreaInput = z.infer<typeof createAreaSchema>;
export type UpdateAreaInput = z.infer<typeof updateAreaSchema>;
