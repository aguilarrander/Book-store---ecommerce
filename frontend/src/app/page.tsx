"use client";

import { useEffect, useState } from "react";
import api from "../lib/axios";
import { useRouter } from "next/navigation";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    api
      .get("/books")
      .then((res) => setBooks(res.data))
      .catch((err) => setMessage("Error al cargar libros."));
  }, []);

  const getUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRole(res.data.role);
      setUsername(res.data.name);  // <- Guardamos el nombre del usuario
    } catch (err) {
      console.error("Error al obtener el usuario:", err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const addToCart = async (bookId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Debes iniciar sesión primero");
      return;
    }

    try {
      await api.post(
        "/cart",
        { book_id: bookId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Libro agregado al carrito");
    } catch (err) {
      setMessage("Error al agregar al carrito." + err);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col items-center justify-center mt-10">

      {/* Mostrar nombre */}
      {username && (
        <div className="mb-4 text-lg font-semibold text-blue-600">
          Bienvenido, {username} 👋
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button onClick={() => router.push("/cart")} className="bg-blue-500 text-white py-2 px-4 rounded">
          🛒 Ir al Carrito
        </button>

        {role === "admin" && (
          <>
            <button onClick={() => router.push("/admin")} className="bg-purple-600 text-white py-2 px-4 rounded">
              Administrar Usuarios
            </button>

            <button onClick={() => router.push("/admin/books")} className="bg-green-600 text-white py-2 px-4 rounded">
              Administrar Libros
            </button>
          </>
        )}

        <button onClick={logout} className="bg-red-600 text-white py-2 px-4 rounded">
          Cerrar sesión
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-4 text-center flex items-center">
        <span className="mr-2">📚</span> Tienda de Libros
      </h1>

      <input
        type="text"
        placeholder="Buscar por título..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        className="border p-2 mb-6 w-96"
      />

      {message && <p className="mb-4 text-blue-600">{message}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {paginatedBooks.map((book) => (
          <div key={book.id} className="border p-4 rounded shadow text-center">
            <h2 className="font-bold text-xl mb-2">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>
            <p className="text-green-600 font-semibold mb-2">
              ${Number(book.price).toFixed(2)}
            </p>
            <button
              onClick={() => addToCart(book.id)}
              className="mt-2 bg-blue-500 text-white py-1 px-4 rounded"
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex mt-6 gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 bg-gray-300 rounded">
            Anterior
          </button>

          <span className="px-3 py-1 font-bold">
            Página {currentPage} de {totalPages}
          </span>

          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 bg-gray-300 rounded">
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
