import express from "express";
import cors from "cors";

import UsersRoutes from "./routes/api/UsersRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(express.json());

// سرو کردن فایل‌های داخل public
app.use(express.static("public"));

// API Routes
app.use("/api/users", UsersRoutes);

// Web Routes

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Server running on port 8000");
});
