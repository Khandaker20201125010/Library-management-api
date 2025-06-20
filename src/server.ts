import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let server: Server;

const PORT = 3000;

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
      console.log("Database connected");
    server = app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
