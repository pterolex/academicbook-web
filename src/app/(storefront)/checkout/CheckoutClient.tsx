"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import { API_URL } from "@/lib/env";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";

interface Values {
  name: string;
  email: string;
  phone: string;
  city: string;
  street: string;
  zip: string;
  notes: string;
  createAccount: boolean;
  password: string;
}

const Schema = Yup.object({
  name: Yup.string().required("Обов'язково"),
  email: Yup.string().email("Невірний e-mail").required("Обов'язково"),
  phone: Yup.string().required("Обов'язково"),
  city: Yup.string().required("Обов'язково"),
  street: Yup.string().required("Обов'язково"),
  zip: Yup.string(),
  notes: Yup.string().max(500),
  createAccount: Yup.boolean(),
  password: Yup.string().when("createAccount", {
    is: true,
    then: (s) => s.min(8, "Мін. 8 символів").required("Обов'язково"),
    otherwise: (s) => s.notRequired(),
  }),
});

export function CheckoutClient() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => s.accessToken);
  const router = useRouter();

  if (items.length === 0) {
    return (
      <p>
        Кошик порожній. <Link href="/">Повернутись до каталогу</Link>.
      </p>
    );
  }

  const initial: Values = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    city: "",
    street: "",
    zip: "",
    notes: "",
    createAccount: false,
    password: "",
  };

  return (
    <Formik<Values>
      initialValues={initial}
      validationSchema={Schema}
      onSubmit={async (values, helpers) => {
        helpers.setStatus(null);
        try {
          const payload = {
            name: values.name,
            email: values.email,
            phone: values.phone,
            city: values.city,
            street: values.street,
            zip: values.zip || undefined,
            notes: values.notes || undefined,
            createAccountPassword:
              !user && values.createAccount ? values.password : undefined,
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
          helpers.setStatus((e as Error).message);
        }
      }}
    >
      {({ isSubmitting, status, values }) => (
        <Form className="space-y-4 max-w-2xl">
          <h1 className="text-xl">Оформлення замовлення</h1>
          {status && (
            <div className="border p-2 text-sm" style={{ borderColor: "#c0392b", color: "#c0392b" }}>
              {status}
            </div>
          )}
          <TextField name="name" label="Ім'я" required />
          <TextField name="email" label="E-mail" type="email" required />
          <TextField name="phone" label="Телефон" required />
          <TextField name="city" label="Місто" required />
          <TextField name="street" label="Адреса" required />
          <TextField name="zip" label="Поштовий індекс" />
          <TextField name="notes" label="Примітки" textarea />

          {!user && (
            <div
              className="border p-3 text-sm space-y-2"
              style={{ borderColor: "var(--ab-border)", background: "var(--ab-bg-alt)" }}
            >
              <label className="flex items-center gap-2">
                <Field type="checkbox" name="createAccount" />
                Створити обліковий запис під час замовлення
              </label>
              {values.createAccount && (
                <TextField name="password" label="Пароль (мін. 8 символів)" type="password" required />
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
            disabled={isSubmitting}
            className="px-4 py-2 rounded-sm text-white disabled:opacity-50"
            style={{ background: "var(--ab-accent)" }}
          >
            {isSubmitting ? "Відправлення…" : "Підтвердити замовлення"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

function TextField({
  name,
  label,
  type = "text",
  required = false,
  textarea = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const [field] = useField(name);
  return (
    <label className="block text-sm">
      <span className="block mb-1">
        {label} {required && <span style={{ color: "#c0392b" }}>*</span>}
      </span>
      {textarea ? (
        <textarea
          {...field}
          rows={3}
          className="w-full border px-3 py-2 rounded-sm"
          style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
        />
      ) : (
        <input
          {...field}
          type={type}
          className="w-full border px-3 py-2 rounded-sm"
          style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
        />
      )}
      <ErrorMessage name={name} component="div" className="text-xs text-red-600" />
    </label>
  );
}
