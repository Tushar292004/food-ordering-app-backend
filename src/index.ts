import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/myUserRoute"
import { v2 as cloudinary } from "cloudinary";

//connecting mongodb uri as string
mongoose
.connect(process.env.MONGODB_URI as string)
.then(() => console.log("Conected to database!"));

//connection to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

//express server assigned to app variable
const app = express();
//middle-ware to convert every request body to json
app.use(express.json())
app.use(cors())

app.get("/health", async (req: Request, res: Response)=> {
    res.send({message: "Health ok!"})
})

// if api req comes on /api/my/user this will run 
app.use("/api/my/user", myUserRoute);

//creating a test page
// app.get("/", async (req: Request, res: Response)=>{
//     res.json({message: "Hello!"});
// });
// listening to the backend server
app.listen(7000, ()=>{
    console.log("Server is running on port 7000");
})
