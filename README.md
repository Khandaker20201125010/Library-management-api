#  Library Management API


A full-featured Library Management System backend built with **Express.js**, **TypeScript**, and **MongoDB (Mongoose)**.

##  Objective

This API allows for managing books and borrowing functionality in a library system, including:

- Book creation, retrieval, update, and deletion
- Borrowing functionality with business logic validation
- Aggregated borrow summary
- Filtering, sorting, and pagination
- Schema validation and Mongoose middleware

##  Features

 **Book Management**  
- Create, retrieve, update, and delete books  
- Genre validation: `FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY`  
- Unique ISBN enforcement  
- Available copies tracking  

 **Borrow Management**  
- Borrow books with validation for available copies  
- Auto-update availability and decrement copies  
- Borrow summary with total quantities (aggregation pipeline)

 **Advanced Mongoose Usage**  
- Pre-save and post-save middleware  
- Schema validation with meaningful errors  
- Static/instance methods for business logic  
- Aggregation for borrow summary  
- Filtering and sorting on GET endpoints

## Step-by-Step Setup Guide


### 1. Initialize a New Project

```bash
npm init -y
```
### 2. Install Required Packages

## Main Dependencies
```bash
npm install express mongoose dotenv cors zod
```
## Development Dependencies (for TypeScript support)

```bash
npm install --save-dev typescript ts-node-dev @types/node @types/express
```

### 3. Initialize TypeScript Configuration

```bash
npx tsc --init
```

- Then update your tsconfig.json with these recommended options:

```bash
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

```

## Folder & File Structure 
src/
├── app.ts # Express app setup, routes
├── server.ts # Server entry point

├── models/
│ ├── books/ # Book model
│ └── borrow/ # Borrow model

├── controllers/
│ ├── books/ # Book controllers
│ └── borrow/ # Borrow controllers

├── utils/
│ └── errorHandler.ts # Centralized error handler

├── interfaces/
│ ├── books/ # Book interfaces
│ └── borrow/ # Borrow interfaces

### 5. Add Scripts to package.json

```bash
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts"
}
```
### Warning 
- create file .env use mongodb url . Be sure when use await mongoose.connect(process.env.MONGO_URI as string); in server.ts. dotenv.config(); should be at the top first otherwise process.env file wont work and mongodb wont work . Make sure the mongodb url are correct otherwise even your postman working but data wont send in mongodb collections . 

- Thank you ,All the Best .
