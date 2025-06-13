const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');
const verifyToken = require('../middlewares/auth.middleware');  

// Agregar al carrito
router.post('/', verifyToken, CartController.add);

// Ver carrito
router.get('/', verifyToken, CartController.getCart);

// Eliminar del carrito
router.delete('/:id', verifyToken, CartController.delete);

module.exports = router;

