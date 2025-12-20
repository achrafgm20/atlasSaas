import mongoose from "mongoose"
const connctDB = async ():Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string)
        console.log(`Mongodb connected successfully `);
    }catch (error) {
    if (error instanceof Error) {
      console.error("MongoDB connection failed:", error.message);
    }
  }
}

export default connctDB