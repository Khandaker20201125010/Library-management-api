import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();


let server: Server;

const PORT = 5000;

async function main() {
    try{
        await mongoose.connect(process.env.MONGO_URL as string);
        server = app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    }catch(error){
        console.log(error);
    }
}

main();