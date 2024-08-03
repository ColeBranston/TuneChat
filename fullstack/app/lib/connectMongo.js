import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("No MongoDB URI provided");
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { connection: null, promise: null };
}

async function connectMongo() {
    if (cached.connection) {
        return cached.connection;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect("mongodb+srv://xtyao2015:vUcA0ecOplEa944a@tune-chat.zsycdmp.mongodb.net/?retryWrites=true&w=majority&appName=tune-chat").then((mongoose) => mongoose);
    }

    try {
        cached.connection = await cached.promise;
        console.log("Connected to MongoDB");
    } catch (error) {
        cached.promise = null;
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Error when connecting to MongoDB");
    }

    return cached.connection;
}

export default connectMongo;
