import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userroute.js";
import authRouter from "./routes/authRoute.js";
import listingRouter from "./routes/listingroute.js"
import cookieParser from "cookie-parser";
import cors from "cors"; 

dotenv.config();
mongoose.connect(process.env.MONGO)
  .then(() => console.log("connected to MongoDB!"))
  .catch((err) => console.log(err));
const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing",listingRouter);

app.use((err, req, res, next) => {
  const statusCode = Number(err.statusCode) || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,  
    message,    
  });
});
const PORT = 8000;
app.listen(PORT, () => console.log(`Server has been started at PORT:${PORT}`));
