import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import { userRouters } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";


const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
  })
);

app.get("/", async (req: Request, res: Response) => {
  res.send("hello world ");
});

app.use("/api/users", userRouters);
app.use('/api/auth', authRoutes)

export default app;
