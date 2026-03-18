import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { paymentController } from "../controllers/payment.controller";
import { dashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

// Dashboard
router.get("/dashboard", authMiddleware, dashboardController.getDashboard);

// Projects
router.post("/project", authMiddleware, adminOnly, projectController.createProject);
router.get("/projects", authMiddleware, projectController.getClientProjects);
router.put("/project/:projectId", authMiddleware, adminOnly, projectController.updateProgress);

// Payments
router.post("/payment", authMiddleware, adminOnly, paymentController.addPayment);

export default router;