import express from "express";
import cors from "cors";
import { PORT } from "./global";
import userRoutes from "./routes/user.routes";
import itemRoutes from "./routes/item.routes";
import borrowRoutes from "./routes/borrow.routes";

const app = express();

app.use(express.json());
app.use(cors());

//Start code here
app.use("/api", userRoutes);
app.use("/api", itemRoutes);
app.use("/api", borrowRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
