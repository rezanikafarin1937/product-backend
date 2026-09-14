import { IndexModel,getProduct,getByPagination } from "../models/ProductsModel.js";
import {searchProductsModel} from "../models/ProductsModel.js";

class ProductsController {
  static Index = (req, res) => {
    IndexModel(req,res)
  };
  static Show = (req,res) =>{
    getProduct(req,res)
  }

  // static InfiniteLoading = (req,res) => {
  //   getByInfinite(req,res)
  // }

  static Pagination = (req,res) => {
    getByPagination(req,res)
  }



  static SearchProducts = async (req, res) => {
  try {
     const { title, page = 1, per_page = 10 } = req.query;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "متن جستجو را وارد کنید",
      });
    }

    const products = await searchProductsModel.getProductsByTitle(title.trim(),Number(page),Number(per_page));

    return res.status(200).json(products);

  } catch (error) {
    console.log("Search Products Error:", error);

    return res.status(500).json({
      message: "خطا در جستجوی محصولات",
    });
  }
};

}

export default ProductsController;
