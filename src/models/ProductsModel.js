import pool from "../database/MySqlConnect.js";
import Table from "./Table.js";

export const searchProductsModel = new Table("products");

export const IndexModel = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        products.id,
        products.title,
        products.description,
        products.price,
        products.discount,
        products.catId,
        images.path
      FROM products
      LEFT JOIN images
        ON products.id = images.ImageId
      ORDER BY products.id
    `);

    const products = [];

    rows.forEach((row) => {
      let product = products.find((item) => item.id === row.id);

      if (!product) {
        product = {
          id: row.id,
          title: row.title,
          description: row.description,
          price: row.price,
          discount: row.discount,
          catId: row.catId,
          images: [],
        };

        products.push(product);
      }

      if (row.path) {
        product.images.push(row.path);
      }
    });

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting products",
    });
  }
};


export const getByPagination = async (req, res) => {
  const table = new Table("products");
  const result = await table.getByPagination(req, res);
  return result;
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        p.id,
        p.title,
        p.description,
        p.price,
        p.discount,
        p.catId,
        i.path
      FROM products AS p
      LEFT JOIN images AS i
        ON p.id = i.imageId
      WHERE p.id = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const product = {
      id: rows[0].id,
      title: rows[0].title,
      description: rows[0].description,
      price: rows[0].price,
      discount: rows[0].discount,
      catId: rows[0].catId,

      images: rows.map((row) => row.path).filter(Boolean),
    };

    res.status(200).json(product);
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
