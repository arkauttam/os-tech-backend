import { Request, Response } from "express";
import prisma from "../db/db.config";
import bcrypt from "bcrypt";
import { createClientSchema } from "../schemas/client.schema";
import { UserType } from "@prisma/client";

const SALT = 10;

export const clientController = {

  async createClient(req: Request, res: Response) {

    try {

      const data = createClientSchema.parse(req.body);

      const exist = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (exist) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashed = await bcrypt.hash(data.password, SALT);

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          contact: data.phone,
          password: hashed,
          type: UserType.CLIENT
        }
      });

      const client = await prisma.client.create({
        data: {
          userId: user.id,
          company: data.company,
          designation: data.designation
        }
      });

      return res.json({
        success: true,
        data: { user, client }
      });

    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }

  }

};