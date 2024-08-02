import cors from "cors";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

const securitySetup = (app: Express) => {
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: "*",
      //   credentials: true,
    })
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10000, // limit each IP to 100 requests per windowMs
    })
  );
  app.use(hpp());
  app.use(express.json());
  app.use(cookieParser());
  app.use(fileUpload());
};

export default securitySetup;
