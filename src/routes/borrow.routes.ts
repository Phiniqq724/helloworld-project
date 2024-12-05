import express from "express";
import {
  borrowItems,
  returnItems,
  getBorrowedItems,
  usageReport,
  analyticReport,
} from "../controllers/borrow.controller";
import { verifyRole, verifyToken } from "../middlewares/authorization";
import {
  borrowItemMiddleware,
  returnItemMiddleware,
  analyticMiddleware,
  usageReportMiddleware,
} from "../middlewares/borrow.middleware";

const app = express();
app.use(express.json());

app.post("/borrow", [borrowItemMiddleware, verifyToken], borrowItems);
app.get("/borrow", [verifyToken, verifyRole(["ADMIN"])], getBorrowedItems);
app.post("/return/:borrowId", [returnItemMiddleware, verifyToken], returnItems);
app.post(
  "/report",
  [usageReportMiddleware, verifyToken, verifyRole(["ADMIN"])],
  usageReport
);
app.post(
  "/analytic",
  [analyticMiddleware, verifyToken, verifyRole(["ADMIN"])],
  analyticReport
);

export default app;
