import { resend } from "@/lib/resend";
import VerificationEmail from "../../emailTemplates/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "anon-review verification code",
      react: VerificationEmail({ username, verifyCode: verifyCode }),
    });
    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error send Verification Email " + error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
};

export default sendVerificationEmail;
