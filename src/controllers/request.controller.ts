import { Response } from "express";
import prisma from "../db/db.config";
import { AuthRequest } from "../middleware/auth.middleware";

export const requestController = {
  // ✅ CLIENT: Create Request
  async createRequest(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      const client = await prisma.client.findUnique({
        where: { userId },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      const { name, description, category, budget, deadline } = req.body;

      const request = await prisma.projectRequest.create({
        data: {
          name,
          description,
          category,
          budget: Number(budget),
          deadline: deadline ? new Date(deadline) : null,
          clientId: client.id,
        },
      });

      // ✅ Save documents
      if (req.files) {
        const files = req.files as Express.Multer.File[];

        await prisma.requestDocument.createMany({
          data: files.map((file) => ({
            fileUrl: file.path,
            requestId: request.id,
          })),
        });
      }

      return res.json({
        success: true,
        message: "Project request submitted",
        data: request,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Request failed",
      });
    }
  },

  // ✅ ADMIN: Get All Requests
  async getAllRequests(req: AuthRequest, res: Response) {
    try {
      const requests = await prisma.projectRequest.findMany({
        include: {
          client: true,
          documents: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json({ success: true, data: requests });
    } catch (error) {
      return res.status(500).json({
        message: "Fetch failed",
      });
    }
  },

  // ✅ ADMIN: Approve Request → Create Project
  async approveRequest(req: AuthRequest, res: Response) {
    try {
      // 🔥 FIX HERE
      const requestId = Array.isArray(req.params.requestId)
        ? req.params.requestId[0]
        : req.params.requestId;

      if (!requestId) {
        return res.status(400).json({ message: "Request ID required" });
      }

      const request = await prisma.projectRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      // ✅ Create Project
      const project = await prisma.project.create({
        data: {
          name: request.name,
          description: request.description,
          category: request.category,
          totalAmount: request.budget,
          deadline: request.deadline,
          clientId: request.clientId,
          status: "PLANNING",
        },
      });

      // ✅ Update request status
      await prisma.projectRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED" },
      });

      return res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Approve failed",
      });
    }
  },
};