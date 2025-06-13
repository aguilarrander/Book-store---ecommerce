const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const verifyToken = require('../middlewares/auth.middleware');  

router.post('/', verifyToken, OrderController.checkout);
router.get('/', verifyToken, OrderController.getOrders);

module.exports = router;

