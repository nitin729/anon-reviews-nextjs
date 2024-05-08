import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be atleast 2 characters \n")
  .max(20, "username must be atmost 20 characters \n")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Special characters are not allowed except underscore(_)",
  );
const emailValidation = z
  .string()
  .email({ message: "Email must be valid address" });
const passwordValidation = z
  .string()
  .min(6, "password must be minimum 6 characters");
export const signUpSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});
