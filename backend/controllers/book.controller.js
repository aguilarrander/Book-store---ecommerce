const Book = require('../models/book.model');

// Crear un libro
exports.create = async (req, res) => {
  try {
    const { title, author, price } = req.body;
    const newBook = await Book.createBook({ title, author, price });
    res.status(201).json({
      message: 'Libro creado correctamente',
      book: newBook
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el libro' });
  }
};

// Obtener todos los libros
exports.getAll = async (req, res) => {
  try {
    const books = await Book.getAllBooks();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los libros' });
  }
};

// Obtener un libro por ID
exports.getById = async (req, res) => {
  try {
    const book = await Book.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el libro' });
  }
};

// Actualizar un libro
exports.update = async (req, res) => {
  try {
    const updatedBook = await Book.updateBook(req.params.id, req.body);
    if (!updatedBook) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json({
      message: 'Libro actualizado correctamente',
      book: updatedBook
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el libro' });
  }
};

// Eliminar un libro
exports.delete = async (req, res) => {
  try {
    const deleted = await Book.deleteBook(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json({ message: 'Libro eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el libro' });
  }
};
