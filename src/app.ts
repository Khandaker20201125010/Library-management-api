import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/book.controllers";
import { borrowRoutes } from "./app/controllers/borrow.controllers";

const app: Application = express();

app.use(express.json());

// Always add CORS headers manually

app.use((req: Request, res: Response, next: any): void => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Library-Management-Api');
});

export default app;
