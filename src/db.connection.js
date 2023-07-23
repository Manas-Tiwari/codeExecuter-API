import mongoose from "mongoose";
import 'dotenv/config';

// Connection URL
const url = process.env.MONGODB_URL;

// Connect to the MongoDB server
await mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("[+] Connected successfully to the database.");
