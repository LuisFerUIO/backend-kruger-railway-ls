import express from "express";
import { saveUser, getUsers, deleteUser} from "../controllers/user.controller.js";
// import { senderEmail } from "../controllers/sendEmail.controller.js";

const router = express.Router();

router.post("/", saveUser);
router.get("/", getUsers);
router.delete("/:id",deleteUser);
// router.post("/sendEmail", senderEmail);

export default router;

//xxx