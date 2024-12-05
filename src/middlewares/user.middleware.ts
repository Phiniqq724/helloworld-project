import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const addUserValidate = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required().valid("ADMIN", "USER"),
}).unknown(false); // Disallow unknown keys

const updateUserValidate = Joi.object({
  name: Joi.string().optional(),
  password: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().optional().valid("ADMIN", "USER"),
}).unknown(false); // Disallow unknown keys

export const addUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await addUserValidate.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error,
    });
  }
};

export const updateUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await updateUserValidate.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error,
    });
  }
};
