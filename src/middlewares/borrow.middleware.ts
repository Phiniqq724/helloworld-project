import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const borrowItemValidate = Joi.object({
  itemId: Joi.number().required(),
  returnDate: Joi.date().required().iso(),
}).unknown(false); // Disallow unknown keys

const returnItemValidate = Joi.object({
  returnDate: Joi.date().required().iso(),
}).unknown(false); // Disallow unknown keys

const usageReport = Joi.object({
  startDate: Joi.date().required().iso(),
  endDate: Joi.date().required().iso().greater(Joi.ref("startDate")),
  groupBy: Joi.string().required().valid("category", "location"),
}).unknown(false);

const analytic = Joi.object({
  startDate: Joi.date().required().iso(),
  endDate: Joi.date().required().iso().greater(Joi.ref("startDate")),
}).unknown(false);

export const borrowItemMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await borrowItemValidate.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error,
    });
  }
};

export const returnItemMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await returnItemValidate.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error,
    });
  }
};

export const usageReportMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await usageReport.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error,
    });
  }
};

export const analyticMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await analytic.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error,
    });
  }
};
