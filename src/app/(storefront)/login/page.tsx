"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/store/auth";
import { API_URL } from "@/lib/env";

const Schema = Yup.object({
  email: Yup.string().email("Невірний e-mail").required("Обов'язково"),
  password: Yup.string().min(8, "Мін. 8 символів").required("Обов'язково"),
});

interface Values {
  email: string;
  password: string;
}

export default function LoginPage() {
  const setAuth = useAuth((s) => s.set);
  const router = useRouter();

  return (
    <Formik<Values>
      initialValues={{ email: "", password: "" }}
      validationSchema={Schema}
      onSubmit={async (values, helpers) => {
        helpers.setStatus(null);
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          if (!res.ok) {
            const b = await res.json().catch(() => ({}));
            throw new Error(b.message ?? "Невірні дані");
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
          <h1 className="text-xl">Вхід</h1>
          {status && <div style={{ color: "#c0392b" }}>{status}</div>}
          <label className="block">
            <span className="text-sm">E-mail</span>
            <Field
              type="email"
              name="email"
              className="w-full border px-3 py-2 rounded-sm"
              style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
            />
            <ErrorMessage name="email" component="div" className="text-xs text-red-600" />
          </label>
          <label className="block">
            <span className="text-sm">Пароль</span>
            <Field
              type="password"
              name="password"
              className="w-full border px-3 py-2 rounded-sm"
              style={{ borderColor: "var(--ab-border)", background: "var(--ab-paper)" }}
            />
            <ErrorMessage name="password" component="div" className="text-xs text-red-600" />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-sm text-white disabled:opacity-50"
            style={{ background: "var(--ab-accent)" }}
          >
            {isSubmitting ? "Вхід…" : "Увійти"}
          </button>
          <p className="text-sm">
            Немає акаунту? <Link href="/register">Зареєструватись</Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}
