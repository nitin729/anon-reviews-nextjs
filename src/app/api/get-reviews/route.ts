import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import connectDB from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Session not autheticated",
      },
      {
        status: 401,
      },
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          id: userId,
        },
      },
      {
        $unwind: "$reviews",
      },
      {
        $sort: {
          "reviews.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          reviews: {
            $push: "reviews",
          },
        },
      },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Reviews fetched successfully",
        data: user[0].reviews,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error retrieving messages",
      },
      {
        status: 500,
      },
    );
  }
}
