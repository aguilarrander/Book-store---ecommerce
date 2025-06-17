"use client";  

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post("/users/register", { ...form, role: "user" });
      setMessage("Usuario registrado correctamente");

      //Redirigimos al login luego de registrarse
      router.push("/login");

    } catch (err) {
      setMessage("Error al registrar usuario" + err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Registro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required className="border p-2" />
        <input name="email" placeholder="Correo" type="email" value={form.email} onChange={handleChange} required className="border p-2" />
        <input name="password" placeholder="Contraseña" type="password" value={form.password} onChange={handleChange} required className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">Registrar</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
