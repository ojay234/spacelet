import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import connectDB from "config/db";

dotenv.config();
const app: Application = express();
app.use(express.json());

connectDB()

app.use("/auth", authRoutes);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello, world!");
// });

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
