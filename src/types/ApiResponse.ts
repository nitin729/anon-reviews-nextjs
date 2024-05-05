import { Review } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  reviews?: Array<Review>;
}
