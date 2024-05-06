import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import brcypt from "bcryptjs";
import sendVerificationEmail from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { username, email, password } = await request.json();

    const existingVerifiedUserbyUserName = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserbyUserName) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        {
          status: 400,
        },
      );
    }

    const existingUserbyEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await brcypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    if (existingUserbyEmail) {
      if (existingUserbyEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user already exists with this email",
          },
          {
            status: 400,
          },
        );
      } else {
        const newUser = new UserModel({
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
          reviews: [],
        });
        await newUser.save();
      }
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        reviews: [],
      });
      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error registering the user: " + error);
    return Response.json(
      {
        success: false,
        message: "Error registering the user",
      },
      {
        status: 500,
      },
    );
  }
}
