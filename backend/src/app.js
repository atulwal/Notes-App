import express from "express"
import cors from "cors"
import mongoose from "mongoose";

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "routes/user.routes.js"

app.use("/users", userRouter)

export {app}