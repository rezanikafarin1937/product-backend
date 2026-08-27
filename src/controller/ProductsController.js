import { IndexModel } from "../models/ProductsModel.js";
class ProductsController {
  static Index = async (req, res) => {
    IndexModel(req,res)
  };
}

export default ProductsController;
