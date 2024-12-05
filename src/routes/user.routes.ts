import express from "express";
import {
  getUser,
  addUser,
  deleteUser,
  updateUser,
  login,
} from "../controllers/user.controller";
import { verifyToken, verifyRole } from "../middlewares/authorization";
import {
  addUserMiddleware,
  updateUserMiddleware,
} from "../middlewares/user.middleware";

const app = express();
app.use(express.json());

//Start Code Here!!!
app.get("/user", [verifyToken, verifyRole(["ADMIN"])], getUser);
app.post(
  "/user",
  [addUserMiddleware, verifyToken, verifyRole(["ADMIN"])],
  addUser
);
app.delete("/user/:id", [verifyToken, verifyRole(["ADMIN"])], deleteUser);
app.put(
  "/user/:id",
  [updateUserMiddleware, verifyToken, verifyRole(["ADMIN"])],
  updateUser
);
app.post("/login", login);

export default app;
