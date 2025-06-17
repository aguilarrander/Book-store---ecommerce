"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

interface OrderItem {
  book_id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  total: number;
  created_at: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-10 w-full relative">

      {/* Botón arriba a la derecha, totalmente alineado */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-0 right-0 m-8 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Volver
      </button>

      {/* Título totalmente centrado */}
      <h1 className="text-3xl font-bold mb-6 text-center">Historial de Compras</h1>

      {orders.map((order) => (
        <div key={order.id} className="border p-4 rounded shadow mb-4 w-96">
          <h2 className="font-bold text-xl">Orden #{order.id}</h2>
          <p className="text-gray-600">Fecha: {new Date(order.created_at).toLocaleString()}</p>

          {order.items.map((item, index) => (
            <div key={index} className="mt-2">
              <p>{item.title} - {item.author}</p>
              <p className="text-green-600">${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}

          <p className="font-bold mt-2">Total: ${order.total}</p>
        </div>
      ))}
    </div>
  );
}
