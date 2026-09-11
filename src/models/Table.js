import pool from "../database/MySqlConnect.js";

class Table {
  constructor(tableName) {
    this.tableName = tableName;
  }

  getAllRecords = async () => {
    const [result] = await pool.query(`select * from ${this.tableName}`);
    return result;
  };

  getRecord = async (id) => {
    const [data] = await pool.query(
      `select * from ${this.tableName} where id = ?`,
      [id],
    );
    return [...data][0];
  };

  getByField = async (field, value) => {
    const [result] = await pool.query(
      `select * from ${this.tableName} where ${field} = ?`,
      [value],
    );
    return result;
  };

  insertRecord = async (data) => {
    const fields = Object.keys(data).join(", ");
    const values = Object.values(data);
    const placeholders = values.map(() => "?").join(", ");

    const sql = `
        INSERT INTO ${this.tableName}
        (${fields})
        VALUES (${placeholders})
    `;

    const [result] = await pool.query(sql, values);

    return result;
  };

  updateRecord = async (id, data) => {
    const fields = Object.keys(data);

    const values = Object.values(data);

    const setQuery = fields.map((field) => `${field} = ?`).join(", ");

    const sql = `
    UPDATE ${this.tableName} 
    SET ${setQuery}
    WHERE id = ?
  `;

    const [result] = await pool.query(sql, [...values, id]);

    return result;
  };

  deleteRecord = async (id) => {
    const record = this.getRecord(id);
    if (record) {
      pool.query(`delete from ${this.tableName} where id = ?`, [id]);
      return record;
    }
    return null;
  };

  /******** Search  ***********/
  async getByLike(field, value) {
    const sql = `
    SELECT *
    FROM ${this.tableName}
    WHERE ${field} LIKE ?
  `;

    const [rows] = await pool.query(sql, [`%${value}%`]);

    return rows;
  }

  // async getProductsByTitle(value) {
  //   const sql = `
  //     SELECT
  //       products.*,
  //       images.Path AS image
  //     FROM products
  //     LEFT JOIN images
  //       ON products.id = images.imageId
  //     WHERE products.title LIKE ?
  //   `;

  //   const [rows] = await pool.query(sql, [`%${value}%`]);

  //   return rows;
  // }

  async getProductsByTitle(value) {
    const sql = `
    SELECT
      products.*,
      images.Path AS imagePath
    FROM products
    LEFT JOIN images
      ON products.id = images.imageId
    WHERE products.title LIKE ?
  `;

    const [rows] = await pool.query(sql, [`%${value}%`]);

    const products = [];

    rows.forEach((row) => {
      let product = products.find((item) => item.id === row.id);

      if (!product) {
        product = {
          ...row,
          images: [],
        };

        delete product.imagePath;

        products.push(product);
      }

      if (row.imagePath) {
        product.images.push(row.imagePath);
      }
    });

    return products;
  }
}

export default Table;
