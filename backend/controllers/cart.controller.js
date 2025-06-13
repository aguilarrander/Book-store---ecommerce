const Cart = require('../models/cart.model');
const db = require('../db/connection'); 

exports.add = async (req, res) => {
  const userId = req.user.id; 
  const { book_id, quantity } = req.body;

  try {
    const item = await Cart.addToCart(userId, book_id, quantity);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al agregar al carrito' });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    // JOIN para traer los datos del libro
    const result = await db.query(`
      SELECT c.id, c.book_id, c.quantity, 
         b.title, b.author, b.price
      FROM cart_items c
      JOIN books b ON c.book_id = b.id
      WHERE c.user_id = $1
    `, [userId]);

    const items = result.rows.map(row => ({
      id: row.id,
      book_id: row.book_id,
      quantity: row.quantity,
      book: {
        title: row.title,
        author: row.author,
        price: row.price
      }
    }));

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

exports.delete = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;

  try {
    const item = await Cart.deleteFromCart(id, userId);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    res.json({ message: 'Producto eliminado del carrito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
};
