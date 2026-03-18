import { Request, Response } from "express";
import prisma from "../db/db.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signupSchema, loginSchema } from "../schemas/user.schema";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util";
import { ZodError } from "zod";
export const userController = {

  // CLIENT SIGNUP
  async signup(req: Request, res: Response) {
    try {
      const data = signupSchema.parse(req.body);

      const exist = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (exist) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      const hashed = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          contact: data.contact,
          password: hashed,
          type: "CLIENT",
        },
      });

      await prisma.client.create({
        data: {
          userId: user.id,
          company: data.company,
          designation: data.designation,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Client registered successfully",
      });

    } catch (error) {

      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error,
        });
      }

      console.error("SIGNUP ERROR:", error);

      return res.status(500).json({
        message: "Signup failed",
        error,
      });
    }
  },

  // LOGIN (ACCESS + REFRESH TOKEN)
 async login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      role: user.type,
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Login failed",
      error
    });
  }
},

  // PROFILE
  async profile(req: AuthRequest, res: Response) {

    try {

      const userId = req.user?.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          client: true
        }
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      return res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          contact: user.contact,
          role: user.type,
          company: user.client?.company || null,
          designation: user.client?.designation || null
        }
      });

    } catch (error) {

      return res.status(500).json({
        message: "Profile fetch failed"
      });

    }

  },

  // REFRESH TOKEN
  async refreshToken(req: Request, res: Response) {

    try {

      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          message: "Refresh token required"
        });
      }

      const stored = await prisma.refreshToken.findUnique({
        where: { token: refreshToken }
      });

      if (!stored) {
        return res.status(403).json({
          message: "Invalid refresh token"
        });
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { id: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const newAccessToken = generateAccessToken(user);

      return res.json({
        accessToken: newAccessToken
      });

    } catch (error) {

      return res.status(403).json({
        message: "Token expired"
      });

    }

  },

  // LOGOUT
  async logout(req: Request, res: Response) {

    try {

      const { refreshToken } = req.body;

      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      });

      return res.json({
        message: "Logged out successfully"
      });

    } catch {

      return res.status(500).json({
        message: "Logout failed"
      });

    }

  }

};