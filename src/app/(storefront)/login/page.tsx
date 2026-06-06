"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth";
import { API_URL } from "@/lib/env";

export default function LoginPage() {
  const setAuth = useAuth((s) => s.set);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.message ?? "Невірні дані");
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
      <h1 className="text-xl">Вхід</h1>
      {error && <div style={{ color: "#c0392b" }}>{error}</div>}
      <label className="block">
        <span className="text-sm">E-mail</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded-sm"
          style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
        />
      </label>
      <label className="block">
        <span className="text-sm">Пароль</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded-sm"
          style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
        />
      </label>
      <button className="px-4 py-2 rounded-sm text-white" style={{ background: "var(--ab-accent)" }}>
        Увійти
      </button>
      <p className="text-sm">
        Немає акаунту? <Link href="/register">Зареєструватись</Link>
      </p>
    </form>
  );
}
