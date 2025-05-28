import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGODB_URI || "";

mongoose.connect(MONGO_URI).then(() => {
  app.listen(PORT, () => {    
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    console.log(`Server running on port ${PORT}`)
  });
})
.catch((err) => {
    console.log("uri", MONGO_URI)
    console.error("MongoDB connection error:", err);
  });
