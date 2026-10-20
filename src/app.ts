import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import globalErrorHandler from "@/middlewares/globalErrorHandler";
import notFound from "@/middlewares/notFound";
import { globalRateLimiter } from "@/middlewares/rateLimiter";
import config from "@/config";
import router from "@/routes";
import dbConnect from "@/utils/dbConnect";

const app: Application = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: config.cors_origins
      ? config.cors_origins.split(",").map((origin) => origin.trim())
      : [
        "http://localhost:3000",
        "http://localhost:3001"
      ],
    credentials: true,
  }),
);

app.use(cookieParser());

if (config.node_env === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.get("/", (req: Request, res: Response) => {
  res.send(`Coffee Membership Backend server is running !`);
});

//custom middleware implementation
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// ensure DB connection for serverless/cold-start environments
app.use(async (req, res, next) => {
  await dbConnect();
  next();
});

// Rate Limiter middleware
app.use("/api/v1", globalRateLimiter);

//application routes
app.use("/api/v1", router);

// Global Error-handling middleware
app.use(globalErrorHandler);

//route not found
app.use(notFound);

export default app;
