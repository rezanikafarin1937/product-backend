import express from "express";
import ProductsController from "../../controller/ProductsController.js";

const router = express.Router();

router.get("/", ProductsController.Pagination);
// router.get("/", ProductsController.Index);
router.get("/search", ProductsController.SearchProducts);
router.get("/:id", ProductsController.Show);

export default router;
