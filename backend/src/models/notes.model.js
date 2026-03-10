import mongoose, {Schema} from "mongooose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const notesSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

export const Notes = mongoose.model("Notes", notesSchema)