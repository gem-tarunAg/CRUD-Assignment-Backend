import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./db/db.connection";
import router from "./routes/user.route";
import bodyParser from "body-parser";
import cors from "cors";

// Load config
dotenv.config({ path: "./config/.env" });

const app = express();

// parsing the url
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logging
app.use(morgan("dev"));

// Middlewares
app.use(cors());

// Routes
app.use("/api", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}...`);
});
