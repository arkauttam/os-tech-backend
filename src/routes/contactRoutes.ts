import express from "express";
import { sendContactMail, testApi } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", sendContactMail);
router.post("/test", testApi);
export default router;