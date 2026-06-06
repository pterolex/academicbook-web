"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/store/auth";
import { API_URL } from "@/lib/env";

const Schema = Yup.object({
  name: Yup.string().max(120),
  email: Yup.string().email("Невірний e-mail").required("Обов'язково"),
  phone: Yup.string().max(40),
  password: Yup.string().min(8, "Мін. 8 символів").required("Обов'язково"),
});

interface Values {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const FIELDS: Array<{ key: keyof Values; label: string; type: string }> = [
  { key: "name", label: "Ім'я", type: "text" },
  { key: "email", label: "E-mail", type: "email" },
  { key: "phone", label: "Телефон", type: "text" },
  { key: "password", label: "Пароль (мін. 8)", type: "password" },
];

export default function RegisterPage() {
  const setAuth = useAuth((s) => s.set);
  const router = useRouter();

  return (
    <Formik<Values>
      initialValues={{ name: "", email: "", phone: "", password: "" }}
      validationSchema={Schema}
      onSubmit={async (values, helpers) => {
        helpers.setStatus(null);
        try {
          const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          if (!res.ok) {
            const b = await res.json().catch(() => ({}));
            throw new Error(b.message ?? "Помилка реєстрації");
          }
          const data = await res.json();
          setAuth({ accessToken: data.accessToken, user: data.user });
          router.push("/account");
        } catch (e) {
          helpers.setStatus((e as Error).message);
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className="space-y-3 max-w-md">
          <h1 className="text-xl">Реєстрація</h1>
          {status && <div style={{ color: "#c0392b" }}>{status}</div>}
          {FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="text-sm">{f.label}</span>
              <Field
                type={f.type}
                name={f.key}
                className="w-full border px-3 py-2 rounded-sm"
                style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
              />
              <ErrorMessage name={f.key} component="div" className="text-xs text-red-600" />
            </label>
          ))}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-sm text-white disabled:opacity-50"
            style={{ background: "var(--ab-accent)" }}
          >
            {isSubmitting ? "Створення…" : "Створити акаунт"}
          </button>
          <p className="text-sm">
            Вже маєте акаунт? <Link href="/login">Увійти</Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}
