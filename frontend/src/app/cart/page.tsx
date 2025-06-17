"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  book_id: number;
  quantity: number;
  book: {
    title: string;
    author: string;
    price: number;
  };
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Debes iniciar sesión");
      return;
    }

    try {
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      setMessage("Error al cargar el carrito.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const deleteItem = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await api.delete(`/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Item eliminado correctamente");
      fetchCart();
    } catch (err) {
      setMessage("Error al eliminar el item.");
    }
  };

  const checkout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const items = cart.map(item => ({
      book_id: item.book_id,
      quantity: item.quantity,
      price: item.book.price
    }));

    try {
      await api.post("/orders", { items }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Compra realizada con éxito");
      setCart([]);
      router.push("/orders");
    } catch (err) {
      setMessage("Error al realizar la compra." + err);
    }
  };

  const total = cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  return (
    <div className="flex flex-col items-center justify-center mt-10">

      {/* Botón de volver al inicio */}
      <button
        onClick={() => router.push("/")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Volver al inicio
      </button>

      <h1 className="text-3xl font-bold mb-4 flex items-center">🛒 Carrito de Compras</h1>

      {message && <p className="mb-4 text-blue-600">{message}</p>}

      {cart.map((item) => (
        <div key={item.id} className="border p-4 rounded shadow mb-4 w-96">
          <h2 className="font-bold text-xl">{item.book.title}</h2>
          <p className="text-gray-600">{item.book.author}</p>
          <p className="text-green-600 font-semibold">
            ${item.book.price} x {item.quantity} = ${(item.book.price * item.quantity).toFixed(2)}
          </p>
          <button
            onClick={() => deleteItem(item.id)}
            className="mt-2 bg-red-500 text-white py-1 px-4 rounded"
          >
            Eliminar
          </button>
        </div>
      ))}

      <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>

      {cart.length > 0 && (
        <button
          onClick={checkout}
          className="mt-6 bg-green-500 text-white py-2 px-6 rounded"
        >
          Finalizar compra
        </button>
      )}
    </div>
  );
}
