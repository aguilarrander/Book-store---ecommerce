"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  role: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error al cargar usuarios.");
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await api.delete(`/users/${id}`);
      setMessage("Usuario eliminado");
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage("Error al eliminar usuario.");
    }
  };

  const changeRole = async (id: number, role: string) => {
    try {
      await api.put(`/users/${id}`, { role });
      setMessage("Rol actualizado");
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage("Error al actualizar rol.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Administración de Usuarios</h1>

      {/* Botón para volver al inicio */}
      <button
        onClick={() => router.push("/")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Volver al inicio
      </button>

      {message && <p className="mb-4 text-blue-600">{message}</p>}

      <table className="w-full border">
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center border">
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className="space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => changeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                >
                  Cambiar Rol
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteUser(user.id)}
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
