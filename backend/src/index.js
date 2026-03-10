import dotenv, { config } from "dotenv"
import express from "express"
import { connectDB } from "./db/index.js"

dotenv.config({
    path: "./.env"
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!", err);
  });
