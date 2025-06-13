const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// Registro
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

// Obtener perfil del usuario autenticado
router.get('/me', verifyToken, userController.getProfile);

// ADMINISTRACIÓN DE USUARIOS (solo admin)
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.put('/:id', verifyToken, isAdmin, userController.updateUser);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
