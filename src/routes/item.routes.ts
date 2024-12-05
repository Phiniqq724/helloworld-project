import express from "express";
import {
  getItems,
  createItem,
  deleteItem,
  updateItem,
} from "../controllers/item.controller";
import { verifyToken, verifyRole } from "../middlewares/authorization";
import {
  addItemMiddleware,
  updateItemMiddleware,
} from "../middlewares/item.middleware";

const app = express();
app.use(express.json());

app.get("/inventory", [verifyToken, verifyRole(["ADMIN", "USER"])], getItems);
app.post(
  "/inventory",
  [addItemMiddleware, verifyToken, verifyRole(["ADMIN"])],
  createItem
);
app.delete("/inventory/:id", [verifyToken, verifyRole(["ADMIN"])], deleteItem);
app.put(
  "/inventory/:id",
  [updateItemMiddleware, verifyToken, verifyRole(["ADMIN"])],
  updateItem
);

export default app;
