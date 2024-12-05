import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const addItemValidate = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  location: Joi.string().required(),
  quantity: Joi.number().required().positive(),
}).unknown(false); // Disallow unknown keys

const updateItemValidate = Joi.object({
  name: Joi.string().optional(),
  category: Joi.string().optional(),
  location: Joi.string().optional(),
  quantity: Joi.number().optional().positive(),
}).unknown(false); // Disallow unknown keys

export const addItemMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await addItemValidate.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error,
    });
  }
};

export const updateItemMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await updateItemValidate.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error,
    });
  }
};
