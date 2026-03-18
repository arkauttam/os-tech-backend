import { Request, Response } from "express";
import prisma from "../db/db.config";

export const paymentController = {

  // ✅ Add Payment
  async addPayment(req: Request, res: Response) {
    try {

      const { projectId, amount, dueDate } = req.body;

      const payment = await prisma.payment.create({
        data: {
          projectId,
          amount,
          dueDate: dueDate ? new Date(dueDate) : null,
          status: "PENDING"
        }
      });

      // update paid amount
      await prisma.project.update({
        where: { id: projectId },
        data: {
          paidAmount: {
            increment: amount
          }
        }
      });

      return res.json({ success: true, data: payment });

    } catch (error) {
      return res.status(500).json({ message: "Payment failed" });
    }
  }

};