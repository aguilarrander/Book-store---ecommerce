const db = require('../db/connection');

exports.createOrder = async (userId, items, total) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id',
      [userId, total]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.book_id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    return orderId;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Obtener órdenes por usuario
exports.getOrdersByUser = async (userId) => {
  const ordersResult = await db.query(
    'SELECT id, total, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  const orders = ordersResult.rows;

  for (const order of orders) {
    const itemsResult = await db.query(
      `SELECT oi.book_id, b.title, b.author, oi.price, oi.quantity
       FROM order_items oi
       JOIN books b ON oi.book_id = b.id
       WHERE oi.order_id = $1`,
      [order.id]
    );
    order.items = itemsResult.rows;
  }

  return orders;
};

