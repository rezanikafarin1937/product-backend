import pool from "../database/MySqlConnect.js";
import {glasses} from "./db/products/glasses.js"

class FakeData {
  static seedProducts = async () => {
    try {
      const sql = `
      INSERT INTO products
      (title, description, price, discount, catId)
      VALUES ?
    `;

      const values = glasses.map((product) => [
        product.title,
        product.description,
        product.price,
        product.discount,
        product.catId,
      ]);

      await pool.query(sql, [values]);

      console.log(`${glasses.length} محصول با موفقیت ذخیره شد.`);
    } catch (error) {
      console.error("خطا در ذخیره محصولات:", error);
    }
  };

  static truncate = async (tableName) => {
    try {
      await pool.query(`TRUNCATE TABLE ${tableName}`);

      console.log("تمام محصولات و شمارنده ID پاک شدند.");
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  static seedImages = async () => {
    try {
      const sql = `
      INSERT INTO images (imageId, Path)
      VALUES (?, ?)
    `;

      for (let i = 1; i <= 200; i++) {
        const imagePath = `/images/${i}/${i}.jfif`;

        await pool.execute(sql, [i, imagePath]);

        console.log(`Image ${i} inserted.`);
      }

      console.log("تمام 200 مسیر عکس با موفقیت ذخیره شدند.");
    } catch (error) {
      console.error("Error:", error);
    }
  };
}

export default FakeData;
