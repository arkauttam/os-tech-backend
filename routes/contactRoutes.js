import express from "express";
import { sendContact } from "../controllers/contactController.js";
const router = express.Router();

router.post("/contact", sendContact);

export default router;