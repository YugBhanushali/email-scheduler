import express, { Application } from "express";
import emailRoutes from "./routes/emailRoutes";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(morgan("dev")); // for logging

// Routes
app.use("/api/", emailRoutes);

app.get("/", (req, res) => {
  return res.send("Hello from server");
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
