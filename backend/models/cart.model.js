const pool = require('../db/connection');

exports.addToCart = async (userId, bookId, quantity) => {
  const result = await pool.query(
    `INSERT INTO cart_items (user_id, book_id, quantity) 
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, bookId, quantity]
  );
  return result.rows[0];
};

exports.getCartByUser = async (userId) => {
  const result = await pool.query(
    `SELECT ci.id, b.title, b.author, b.price, ci.quantity, 
            (b.price * ci.quantity) as total
     FROM cart_items ci
     JOIN books b ON ci.book_id = b.id
     WHERE ci.user_id = $1`,
    [userId]
  );
  return result.rows;
};

exports.deleteFromCart = async (id, userId) => {
  const result = await pool.query(
    `DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
};


exports.clearCartByUser = async (userId) => {
  await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
};