import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};
const connectDB = async () => {
  if (connection.isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Database conneced successfully");
  } catch (error) {
    console.log("Error connecting database", error);
    process.exit(1);
  }
};

export default connectDB;
