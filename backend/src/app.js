import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import userRouter from "./routes/user.routes.js"
import noteRouter from "./routes/note.routes.js"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/users", userRouter)
app.use("/notes", noteRouter)

export {app}