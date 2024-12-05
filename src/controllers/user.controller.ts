import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";
import { SECRET } from "../global";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "pretty" });

// Start Code here
export const getUser = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const users = await prisma.user.findMany({
      where: { name: { contains: search?.toString() || "" } },
    });

    return res
      .json({
        status: "success",
        data: users,
        message: "Successfully get all users",
      })
      .status(200);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: `There is an error ${error}`,
      error: error,
    });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: md5(password),
        role,
      },
    });

    return res
      .json({
        status: "success",
        data: newUser,
        message: "Successfully add new user",
      })
      .status(201);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: `There is an error ${error}`,
      error: error,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const findUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!findUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        email: email,
        password: md5(password),
        role: role,
      },
    });

    return res.status(200).json({
      status: "success",
      data: updatedUser,
      message: "Successfully update user",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: `There is an error ${error}`,
      error: error,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!findUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return res
      .json({
        status: "success",
        message: "Successfully delete user",
      })
      .status(200);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: `There is an error ${error}`,
      error: error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const findUser = await prisma.user.findFirst({
      where: { email, password: md5(password) },
    });
    if (!findUser) {
      return res
        .json({
          status: "error",
          message: "User not found or incorrect password",
        })
        .status(404);
    }

    let data = {
      id: findUser.id,
      name: findUser.name,
      email: findUser.email,
      role: findUser.role,
    };

    let payLoad = JSON.stringify(data);

    const token = sign(payLoad, SECRET || "Token");

    return res.json({
      status: "success",
      data: { ...data, token },
      message: "Successfully login",
    });
  } catch (error) {}
};
