import { Response } from "express";
import prisma from "../db/db.config";
import { AuthRequest } from "../middleware/auth.middleware";
import { Prisma } from "@prisma/client";

export const dashboardController = {
  async getDashboard(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      const client = await prisma.client.findUnique({
        where: { userId },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      const projects = (await prisma.project.findMany({
        where: { clientId: client.id },
        include: { payments: true },
      })) as any[];

      const totalProjects = projects.length;

      const inProgress = projects.filter(
        (p) => p.status === "IN_PROGRESS",
      ).length;

      const totalBudget = projects.reduce((sum, p) => sum + p.totalAmount, 0);

      const paidAmount = projects.reduce((sum, p) => sum + p.paidAmount, 0);

      const pendingPayments = projects.flatMap((p) =>
        p.payments.filter((pay: any) => pay.status === "PENDING"),
      );

      return res.json({
        success: true,
        data: {
          totalProjects,
          inProgress,
          totalBudget,
          paidAmount,
          pendingPayments,
          projects,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Dashboard failed",
      });
    }
  },
};
