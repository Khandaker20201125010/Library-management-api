
import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/book.controllers";



const app : Application = express();

app.use(express.json());


app.use("/api/books", bookRoutes);


app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Library-Management-Api');
});

export default app;