import pool from "../database/MySqlConnect.js";

class Table {
  constructor(tableName) {
    this.tableName = tableName;
  }

  getAllRecords = async () => {
    const [result] = await pool.query(`select * from ${this.tableName}`);
    return result;
  };



getByPagination = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // گرفتن محصولات
        const dataSql = `
            SELECT *
            FROM ${this.tableName}
            LIMIT ? OFFSET ?
        `;

        // تعداد کل محصولات
        const countSql = `
            SELECT COUNT(*) AS total
            FROM ${this.tableName}
        `;

        const [[countResult], [products]] = await Promise.all([
            pool.query(countSql),
            pool.query(dataSql, [limit, skip])
        ]);

        const total = countResult[0].total;

        // اگر محصولی وجود داشت، تصاویر آنها را بگیر
        if (products.length > 0) {

            const productIds = products.map(product => product.id);

            const placeholders = productIds.map(() => '?').join(',');

            const imageSql = `
                SELECT imageId, Path
                FROM images
                WHERE imageId IN (${placeholders})
            `;

            const [images] = await pool.query(
                imageSql,
                productIds
            );

            // قرار دادن تصاویر داخل هر محصول
            products.forEach(product => {

                product.images = images
                    .filter(image => image.imageId === product.id)
                    .map(image => image.Path);

            });
        }

        const hasMore = skip + products.length < total;

        return res.status(200).json({
            data: products,
            page,
            limit,
            total,
            hasMore
        });

    } catch (error) {

        console.log("Pagination Error:", error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
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

  async getProductsByTitle(value, page = 1, per_page = 10) {
    const offset = (page - 1) * per_page;

    // تعداد کل محصولات
    const countSql = `
    SELECT COUNT(*) AS total
    FROM products
    WHERE title LIKE ?
  `;

    const [countRows] = await pool.query(countSql, [`%${value}%`]);

    const total = countRows[0].total;

    const pages = Math.ceil(total / per_page);

    // دریافت محصولات صفحه مورد نظر
    const sql = `
    SELECT
      products.*,
      images.Path AS imagePath
    FROM (
      SELECT *
      FROM products
      WHERE title LIKE ?
      ORDER BY id
      LIMIT ? OFFSET ?
    ) AS products
    LEFT JOIN images
      ON products.id = images.imageId
    ORDER BY products.id
  `;

    const [rows] = await pool.query(sql, [`%${value}%`, per_page, offset]);

    // تبدیل ردیف‌های تکراری تصاویر به یک محصول
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

    const pagination = {
      first: pages > 0 ? 1 : null,
      prev: page > 1 ? page - 1 : null,
      next: page < pages ? page + 1 : null,
      last: pages,
      pages: pages,
      page: page,
      per_page: per_page,
      total: total,
    };

    return {
      data: products,
      pagination,
    };
  }
}

export default Table;
