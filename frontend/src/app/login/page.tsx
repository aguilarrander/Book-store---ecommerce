"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", form);
      
      console.log("Respuesta completa:", res.data);

      const token = res.data.token;

      if (!token) {
        setMessage("No se recibió el token del backend.");
        return;
      }

      localStorage.setItem("token", token);
      setMessage("Login exitoso");

      router.push("/");
      
    } catch (err) {
      console.error(err);
      setMessage("Credenciales inválidas");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Iniciar sesión</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
        <input
          name="email"
          placeholder="Correo"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="border p-2"
        />
        <input
          name="password"
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          className="border p-2"
        />
        <button type="submit" className="bg-green-500 text-white py-2 rounded">
          Entrar
        </button>
      </form>

      {/* ✅ Agregamos aquí el botón de registro */}
      <button
        onClick={() => router.push("/register")}
        className="mt-4 text-blue-600 underline"
      >
        ¿No tienes cuenta? Regístrate aquí
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
