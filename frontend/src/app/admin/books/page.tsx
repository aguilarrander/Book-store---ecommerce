"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { useRouter } from "next/navigation";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
}

export default function BooksAdmin() {
  const [books, setBooks] = useState<Book[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ id: 0, title: "", author: "", price: "" });
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error al cargar libros.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.put(`/books/${form.id}`, {
          title: form.title,
          author: form.author,
          price: parseFloat(form.price),
        });
        setMessage("Libro actualizado");
      } else {
        await api.post("/books", {
          title: form.title,
          author: form.author,
          price: parseFloat(form.price),
        });
        setMessage("Libro agregado");
      }

      setForm({ id: 0, title: "", author: "", price: "" });
      setIsEditing(false);
      fetchBooks();
    } catch (err) {
      console.error(err);
      setMessage("Error al guardar");
    }
  };

  const editBook = (book: Book) => {
    setForm({ ...book, price: book.price.toString() });
    setIsEditing(true);
  };

  const deleteBook = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este libro?")) return;

    try {
      await api.delete(`/books/${id}`);
      setMessage("Libro eliminado");
      fetchBooks();
    } catch (err) {
      console.error(err);
      setMessage("Error al eliminar");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Administración de Libros</h1>

      <button
        onClick={() => router.push("/")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
        >
        Volver al inicio
      </button>


      {message && <p className="mb-4 text-blue-600">{message}</p>}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleInput}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Autor"
          value={form.author}
          onChange={handleInput}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={form.price}
          onChange={handleInput}
          className="border p-2 w-full"
          required
          step="0.01"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {isEditing ? "Actualizar Libro" : "Agregar Libro"}
        </button>
      </form>

      {/* Tabla */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="text-center border">
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>${Number(book.price).toFixed(2)}</td>
              <td className="space-x-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => editBook(book)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteBook(book.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
