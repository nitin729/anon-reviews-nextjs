import { Review } from "@/model/User";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  try {
    const { username, review } = await request.json();
    await connectDB();
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
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
    const userReview = {
      content: review,
      createdAt: new Date(),
    };
    user.reviews.push(userReview as Review);
    user.save();
    return Response.json(
      {
        success: true,
        message: "Review posted successfully",
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
        message: "Error posting reviews",
      },
      {
        status: 500,
      },
    );
  }
}
