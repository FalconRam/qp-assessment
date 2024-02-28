import express from "express";
import { loginController } from "../../controllers/loginController";

const router = express.Router();

router.post("/login", loginController);

export default router;
