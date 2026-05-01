import { z } from "zod";

/** POST logout / maintenance — corps vide strict */
export const emptyJsonBodySchema = z.object({}).strict();
