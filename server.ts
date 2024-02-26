import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

import rootRouter from "./routes/index.ts";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(
  express.json({
    limit: "30mb",
  })
);
app.use(
  express.urlencoded({
    limit: "30mb",
    extended: true,
  })
);
app.use(cors());

// To Check if app is up!
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Grocery Booking App");
});

app.use("/api/v1", rootRouter);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

server.on("error", (error) => {
  console.error("Failed to start the server:", error);
});
