import express from "express"
import mongoose from "mongoose";
import   dotenv from   "dotenv";
import userRouter from "./routes/userroute.js"
dotenv.config();
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to MongoDB!");
})
.catch((err)=>{
console.log(err);
})
const app=express();
const PORT=8000;
app.listen(PORT,()=>console.log(`Server has been started at PORT:${PORT}`));
app.use("/api/user",userRouter);