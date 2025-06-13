const pool = require('../db/connection');

exports.createBook = async (data) => {
  const { title, author, description, price, category, image_url } = data;
  const result = await pool.query(
    `INSERT INTO books (title, author, description, price, category, image_url) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, author, description, price, category, image_url]
  );
  return result.rows[0];
};

exports.getAllBooks = async () => {
  const result = await pool.query('SELECT * FROM books');
  return result.rows;
};

exports.getBookById = async (id) => {
  const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
  return result.rows[0];
};

exports.updateBook = async (id, data) => {
  const { title, author, description, price, category, image_url } = data;
  const result = await pool.query(
    `UPDATE books 
     SET title=$1, author=$2, description=$3, price=$4, category=$5, image_url=$6 
     WHERE id=$7 RETURNING *`,
    [title, author, description, price, category, image_url, id]
  );
  return result.rows[0];
};

exports.deleteBook = async (id) => {
  const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
