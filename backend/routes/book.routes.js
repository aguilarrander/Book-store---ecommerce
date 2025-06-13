const express = require('express');
const router = express.Router();
const BookController = require('../controllers/book.controller');
const verifyToken = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// Obtener todos los libros (público)
router.get('/', BookController.getAll);

// Obtener libro por ID (público)
router.get('/:id', BookController.getById);

// Crear libro (solo admin)
router.post('/', verifyToken, isAdmin, BookController.create);

// Actualizar libro (solo admin)
router.put('/:id', verifyToken, isAdmin, BookController.update);

// Eliminar libro (solo admin)
router.delete('/:id', verifyToken, isAdmin, BookController.delete);

module.exports = router;
