import pool from "../database/MySqlConnect.js";

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