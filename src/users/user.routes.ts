import { Router } from "express";
import { userController } from "./user.controller";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.post("/refresh-token", userController.refreshToken);

router.post("/logout", userController.logout);

router.get("/profile", authMiddleware, userController.profile);

router.post( "/admin", authMiddleware, adminOnly, adminController.createAdmin);

export const userRoutes = router;