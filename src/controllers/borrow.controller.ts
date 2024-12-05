import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const borrowItems = async (req: Request, res: Response) => {
  try {
    const { itemId, returnDate } = req.body;
    const user = req.body.user;

    const quantity = 1;

    const borrowedItems = await prisma.borrow.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        item: {
          connect: {
            id: itemId,
          },
        },
        quantity: quantity,
        returnAt: new Date(returnDate).toISOString(),
      },
    });

    // Decrease the quantity of the item after successful borrow
    await prisma.item.update({
      where: { id: itemId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    return res
      .json({
        status: "success",
        data: borrowedItems,
        message: "Successfully borrowed items",
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

export const getBorrowedItems = async (req: Request, res: Response) => {
  try {
    const borrowedItems = await prisma.borrow.findMany({
      include: {
        item: true,
        user: true,
      },
    });

    return res
      .json({
        status: "success",
        data: borrowedItems,
        message: "Successfully get all borrowed items",
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

export const returnItems = async (req: Request, res: Response) => {
  try {
    const { borrowId } = req.params;
    const { returnDate } = req.body;

    const quantity = 1;
    const borrowedItems = await prisma.borrow.findUnique({
      where: {
        id: parseInt(borrowId),
      },
      include: {
        item: true,
      },
    });

    if (!borrowedItems) {
      return res.status(404).json({
        status: "error",
        message: "Borrowed items not found",
      });
    }

    if (
      borrowedItems.status === "RETURNED" ||
      borrowedItems.status === "LATE"
    ) {
      return res.status(400).json({
        status: "error",
        message: "Items already returned",
      });
    }

    let returnItems;
    if (new Date(returnDate) > borrowedItems.returnAt) {
      returnItems = await prisma.borrow.update({
        where: { id: parseInt(borrowId) },
        data: {
          status: "LATE",
        },
      });
    } else {
      returnItems = await prisma.borrow.update({
        where: { id: parseInt(borrowId) },
        data: {
          status: "RETURNED",
        },
      });
    }

    // Increase the quantity of the item after successful return
    await prisma.item.update({
      where: { id: borrowedItems.itemId },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: returnItems,
      message: "Successfully returned items",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: `There is an error ${error}`,
      error: error,
    });
  }
};

export const usageReport = async (req: Request, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      groupBy,
    }: {
      startDate: string;
      endDate: string;
      groupBy: "category" | "location";
    } = req.body;

    // Validate that groupBy is either 'category' or 'location'
    if (!["category", "location"].includes(groupBy)) {
      return res.status(400).json({
        status: "error",
        message: 'Invalid groupBy value. Use "category" or "location".',
      });
    }

    // Fetch borrowed items within the given period
    const borrowedItems = await prisma.borrow.findMany({
      where: {
        returnAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        item: true, // Include item details
      },
    });

    // Group by the selected criteria (category or location)
    const usageAnalysis = borrowedItems.reduce((acc, borrow) => {
      const group = borrow.item[groupBy as "category" | "location"]; // Dynamically group by 'category' or 'location'

      if (!acc[group]) {
        acc[group] = {
          group,
          total_borrowed: 0,
          total_returned: 0,
          items_in_use: 0,
        };
      }

      acc[group].total_borrowed += borrow.quantity;
      acc[group].total_returned +=
        borrow.status === "RETURNED" || borrow.status === "LATE"
          ? borrow.quantity
          : 0;
      acc[group].items_in_use +=
        borrow.status === "BORROWED"
          ? borrow.quantity
          : borrow.status === "LATE"
          ? 0
          : -borrow.quantity;

      return acc;
    }, {} as Record<string, { group: string; total_borrowed: number; total_returned: number; items_in_use: number }>);

    const usageAnalysisArray = Object.values(usageAnalysis);

    return res.status(200).json({
      status: "success",
      data: {
        analysis_period: {
          start_date: startDate,
          end_date: endDate,
        },
        usage_analysis: usageAnalysisArray,
      },
      message: "Successfully generated usage report",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: `There was an error: ${error}`,
      error,
    });
  }
};

export const analyticReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;

    // 1. Frequently Borrowed Items Query
    const frequentlyBorrowedItems = await prisma.borrow.groupBy({
      by: ["itemId"],
      where: {
        createdAt: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
    });

    // Include item details for frequently borrowed items
    const frequentItemsDetails = await Promise.all(
      frequentlyBorrowedItems.map(async (borrow) => {
        const item = await prisma.item.findUnique({
          where: { id: borrow.itemId },
        });
        return {
          item_id: borrow.itemId,
          name: item?.name || "Unknown",
          category: item?.category || "Unknown",
          total_borrowed: borrow._sum.quantity || 0,
        };
      })
    );

    // 2. Inefficient Items Query (based on late returns)
    const inefficientItems = await prisma.borrow.findMany({
      where: {
        returnAt: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
        status: "LATE",
      },
      include: {
        item: true,
      },
    });

    // Include item details for inefficient items (calculate late returns)
    const inefficientItemsDetails = inefficientItems.map((borrow) => {
      return {
        item_id: borrow.itemId,
        name: borrow.item.name,
        category: borrow.item.category,
        total_borrowed: borrow.quantity,
        total_late_returns: borrow.quantity,
      };
    });

    // Final response structure
    return res.status(200).json({
      status: "success",
      data: {
        analysis_period: {
          start_date: startDate,
          end_date: endDate,
        },
        frequently_borrowed_items: frequentItemsDetails,
        inefficient_items: inefficientItemsDetails,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: `There was an error: ${error}`,
      error: error,
    });
  }
};
