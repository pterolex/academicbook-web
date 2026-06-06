"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { API_URL } from "@/lib/env";

export default function RegisterPage() {
  const setAuth = useAuth((s) => s.set);
  const router = useRouter();
  const [f, setF] = useState({ email: "", password: "", name: "", phone: "" });
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.message ?? "Помилка реєстрації");
      }
      const data = await res.json();
      setAuth({ accessToken: data.accessToken, user: data.user });
      router.push("/account");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-md">
      <h1 className="text-xl">Реєстрація</h1>
      {error && <div style={{ color: "#c0392b" }}>{error}</div>}
      {(["name", "email", "phone", "password"] as const).map((k) => (
        <label key={k} className="block">
          <span className="text-sm">
            {k === "email" ? "E-mail" : k === "name" ? "Ім’я" : k === "phone" ? "Телефон" : "Пароль (мін. 8)"}
          </span>
          <input
            type={k === "password" ? "password" : k === "email" ? "email" : "text"}
            required={k === "email" || k === "password"}
            value={f[k]}
            onChange={(e) => setF({ ...f, [k]: e.target.value })}
            className="w-full border px-3 py-2 rounded-sm"
            style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
          />
        </label>
      ))}
      <button className="px-4 py-2 rounded-sm text-white" style={{ background: "var(--ab-accent)" }}>
        Створити акаунт
      </button>
      <p className="text-sm">
        Вже маєте акаунт? <Link href="/login">Увійти</Link>
      </p>
    </form>
  );
}
