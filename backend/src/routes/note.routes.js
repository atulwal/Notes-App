import {Router} from "express"
import { createNotes, getNotes, deleteNotes} from "../controllers/notes.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/").get(createNotes)
router.route("/").post(getNotes)
router.route("/:id").delete(verifyJWT, deleteNotes)

export default router