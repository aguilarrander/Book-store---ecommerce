const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

exports.checkout = async (req, res) => {
  const userId = req.user.id;

  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No hay items para procesar la orden' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderId = await Order.createOrder(userId, items, total);

    await Cart.clearCartByUser(userId);
    
    res.json({ message: 'Orden creada correctamente', orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear la orden: ' + err });
  }
};

exports.getOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.getOrdersByUser(userId);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener las órdenes' });
  }
};