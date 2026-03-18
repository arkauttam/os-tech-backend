import { Request, Response } from "express";
import prisma from "../db/db.config";

export const projectController = {
  // ✅ Create Project (ADMIN)
  async createProject(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        category,
        totalAmount,
        deadline,
        clientId,
      } = req.body;

      const project = await prisma.project.create({
        data: {
          name,
          description,
          category,
          status: "PLANNING",
          totalAmount: Number(totalAmount),
          deadline: deadline ? new Date(deadline) : null,
          clientId,
        },
      });

      return res.json({ success: true, data: project });
    } catch (error) {
      return res.status(500).json({ message: "Create project failed" });
    }
  },

  // ✅ Get Client Projects
  async getClientProjects(req: any, res: Response) {
    try {
      const userId = req.user.id;

      const client = await prisma.client.findUnique({
        where: { userId },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      const projects = await prisma.project.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: "desc" },
      });

      return res.json({ success: true, data: projects });
    } catch (error) {
      return res.status(500).json({ message: "Fetch failed" });
    }
  },

  // ✅ Update Progress
  async updateProgress(req: Request, res: Response) {
    try {
      // 🔥 FIX HERE
      const projectId = Array.isArray(req.params.projectId)
        ? req.params.projectId[0]
        : req.params.projectId;

      if (!projectId) {
        return res.status(400).json({ message: "Project ID required" });
      }

      const { progress, status } = req.body;

      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          progress: Number(progress),
          status,
        },
      });

      return res.json({ success: true, data: project });
    } catch (error) {
      return res.status(500).json({ message: "Update failed" });
    }
  },
};