import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getItems = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const items = await prisma.item.findMany({
      where: { name: { contains: search?.toString() || "" } },
    });
    return res
      .json({
        status: "success",
        data: items,
        message: "Successfully get all items",
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

export const createItem = async (req: Request, res: Response) => {
  try {
    const { name, category, location, quantity } = req.body;
    const newItem = await prisma.item.create({
      data: {
        name,
        category,
        location,
        quantity: parseInt(quantity),
      },
    });
    return res
      .json({
        status: "success",
        data: newItem,
        message: "Successfully add new item",
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

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { name, category, location, quantity } = req.body;

    const findItem = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!findItem) {
      return res.status(400).json({
        status: "error",
        message: "Item not found",
      });
    }
    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        name: name || findItem.name,
        category: category || findItem.category,
        location: location || findItem.location,
        quantity: parseInt(quantity) || findItem.quantity,
      },
    });

    return res
      .json({
        status: "success",
        data: updatedItem,
        message: "Successfully update item",
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

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findItem = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!findItem) {
      return res.status(400).json({
        status: "error",
        message: "Item not found",
      });
    }
    await prisma.item.delete({
      where: { id: parseInt(id) },
    });
    return res
      .json({
        status: "success",
        message: "Successfully delete item",
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
