import express from "express";
import cors from "cors";

import pagesRoute from "./router/web/PagesRoutes.js";
import UsersRoutes from "./router/api/UsersRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

// سرو کردن فایل‌های داخل public
app.use(express.static("public"));

// API Routes
app.use("/api/users", UsersRoutes);

// Web Routes
app.use("/", pagesRoute);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});