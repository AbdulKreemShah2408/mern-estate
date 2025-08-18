import express from "express"
const app=express();
const PORT=8000;
app.listen(PORT,()=>console.log(`Server has been started at PORT:${PORT}`));