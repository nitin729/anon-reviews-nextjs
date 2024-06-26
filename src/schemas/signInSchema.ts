import { z } from "zod";

const usernameValidation = z
  .string()
  .min(2, "username must be atleast 2 characters")
  .max(20, "username must be atmost 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Special characters are not allowed except underscore(_)",
  );
const passwordValidation = z
  .string()
  .min(6, "password must be minimum 6 characters");

export const signInSchema = z.object({
  username: usernameValidation,
  password: passwordValidation,
});
