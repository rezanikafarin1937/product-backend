import express from "express";
import ProductsController from "../../controller/ProductsController.js";

const router = express.Router();

router.get("/", ProductsController.Index);
// router.get("/products/:id", ProductsController.Show);

export default router;
