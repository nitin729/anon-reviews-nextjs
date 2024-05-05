import { z } from "zod";

export const verifySchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must not be greated than 6 digits"),
});
