import { MongoClient } from "mongodb";

// database connection
const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
    console.log("MongoDB connected");
} catch (err) {
    console.log(err);
}

const db = mongoClient.db("matera");
