import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// instance of express
const app = express();

// configs
app.use(cors());
app.use(express.json());
dotenv.config();

// starts the server
const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));
