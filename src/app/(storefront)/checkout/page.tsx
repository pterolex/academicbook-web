"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { API_URL } from "@/lib/env";

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => s.accessToken);
  const router = useRouter();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    city: "",
    street: "",
    zip: "",
    notes: "",
    createAccount: false,
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return <p>Кошик порожній. <a href="/">Повернутись до каталогу</a>.</p>;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        street: form.street,
        zip: form.zip || undefined,
        notes: form.notes || undefined,
        createAccountPassword:
          !user && form.createAccount ? form.password : undefined,
        items: items.map((i) => ({ code: i.code, qty: i.qty })),
      };
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Помилка оформлення");
      }
      const order = await res.json();
      clear();
      router.push(`/checkout/success?code=${order.code}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-2xl">
      <h1 className="text-xl">Оформлення замовлення</h1>
      {error && (
        <div className="border p-2 text-sm" style={{ borderColor: "#c0392b", color: "#c0392b" }}>
          {error}
        </div>
      )}
      <Field label="Ім’я" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
      <Field label="E-mail" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
      <Field label="Телефон" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
      <Field label="Місто" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
      <Field label="Адреса" value={form.street} onChange={(v) => setForm({ ...form, street: v })} required />
      <Field label="Поштовий індекс" value={form.zip} onChange={(v) => setForm({ ...form, zip: v })} />
      <Field label="Примітки" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} textarea />

      {!user && (
        <div
          className="border p-3 text-sm space-y-2"
          style={{ borderColor: "var(--ab-border)", background: "var(--ab-bg-alt)" }}
        >
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.createAccount}
              onChange={(e) => setForm({ ...form, createAccount: e.target.checked })}
            />
            Створити обліковий запис під час замовлення
          </label>
          {form.createAccount && (
            <Field
              label="Пароль (мін. 8 символів)"
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              required
            />
          )}
        </div>
      )}

      <div className="border p-3" style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}>
        <div className="font-semibold mb-1">Замовлення</div>
        <ul className="text-sm space-y-1">
          {items.map((i) => (
            <li key={i.code}>
              {i.titleUa} × {i.qty} = {(i.price * i.qty).toFixed(2)} ₴
            </li>
          ))}
        </ul>
        <div className="mt-2 font-semibold">Разом: {subtotal.toFixed(2)} ₴</div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded-sm text-white disabled:opacity-50"
        style={{ background: "var(--ab-accent)" }}
      >
        {submitting ? "Відправлення…" : "Підтвердити замовлення"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="block mb-1">
        {label} {required && <span style={{ color: "#c0392b" }}>*</span>}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full border px-3 py-2 rounded-sm"
          style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border px-3 py-2 rounded-sm"
          style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
        />
      )}
    </label>
  );
}
