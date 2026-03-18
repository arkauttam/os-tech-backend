import { Router } from "express";
import { requestController } from "../controllers/request.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";
import { upload } from "../utils/multer";

const router = Router();

// CLIENT
router.post(
  "/request",
  authMiddleware,
  upload.array("documents"),
  requestController.createRequest
);

// ADMIN
router.get(
  "/requests",
  authMiddleware,
  adminOnly,
  requestController.getAllRequests
);

router.post(
  "/request/:requestId/approve",
  authMiddleware,
  adminOnly,
  requestController.approveRequest
);

export default router;