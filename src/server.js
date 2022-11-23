import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import { routes } from "./routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoClient = new MongoClient(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const main = async () => {
    await mongoClient.connect();
    const db = mongoClient.db("matera");
    routes(app, db);

    app.listen(PORT, () => {
        console.log(`server running on port: ${PORT}`);
    });
};

main();