import mongoose from "mongoose";

async function dbConnection() {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        console.log("Database connected successfully", db.connection.host);
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit()
    }
}

export default dbConnection