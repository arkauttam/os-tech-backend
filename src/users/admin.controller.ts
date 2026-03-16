import { Request, Response } from "express";
import prisma from "../db/db.config";
import bcrypt from "bcrypt";

export const adminController = {

  async createAdmin(req: Request, res: Response) {

    try {

      const { name, email, contact, password } = req.body;

      const exist = await prisma.user.findUnique({
        where: { email }
      });

      if (exist) {
        return res.status(400).json({
          message: "Email already exists"
        });
      }

      const hashed = await bcrypt.hash(password, 10);

      const admin = await prisma.user.create({
        data: {
          name,
          email,
          contact,
          password: hashed,
          type: "ADMIN"
        }
      });

      return res.json({
        success: true,
        data: admin
      });

    } catch (error) {

      return res.status(500).json({
        message: "Admin creation failed"
      });

    }

  }

};