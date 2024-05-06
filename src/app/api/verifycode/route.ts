import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verfiySchema";
import { z } from "zod";

const VerifySchemaQuery = z.string(verifySchema);

export async function POST(request: Request) {
  await connectDB();

  try {
    const { username, verifyCode } = await request.json();
    const result = VerifySchemaQuery.safeParse(verifyCode);
    console.log(result.data);
    if (!result.success) {
      const formattedError = result.error.format()._errors || [];
      return Response.json(
        {
          success: false,
          message: formattedError,
        },
        {
          status: 500,
        },
      );
    }

    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User does not exist",
        },
        {
          status: 404,
        },
      );
    }

    const isCodeCorrect = user.verifyCode === verifyCode ? true : false;
    const isCodeNotExpired =
      new Date(user.verifyCodeExpiry) > new Date()
        ? true
        : false
          ? true
          : false
            ? true
            : false;

    if (isCodeCorrect && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 201,
        },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code is expired",
        },
        {
          status: 402,
        },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification code",
        },
        {
          status: 402,
        },
      );
    }
  } catch (error) {
    console.error("Verification failed", error);
    return Response.json(
      {
        success: false,
        message: "Verification failed",
      },
      {
        status: 500,
      },
    );
  }
}
