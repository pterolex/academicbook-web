"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/store/auth";
import { useApi } from "@/hooks/useApi";
import { FormField } from "@/components/FormField";

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

export function RegisterClient() {
  const setAuth = useAuth((s) => s.set);
  const api = useApi();
  const router = useRouter();

  return (
    <Formik<Values>
      initialValues={{ name: "", email: "", phone: "", password: "" }}
      validationSchema={Schema}
      onSubmit={async (values, helpers) => {
        helpers.setStatus(null);
        try {
          const { accessToken, user } = await api.auth.register(values);
          setAuth({ accessToken, user });
          router.push("/account");
        } catch (e) {
          helpers.setStatus((e as Error).message || "Помилка реєстрації");
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className="space-y-3 max-w-md">
          <h1 className="text-xl">Реєстрація</h1>
          {status && <div style={{ color: "#c0392b" }}>{status}</div>}
          <FormField name="name" label="Ім'я" />
          <FormField name="email" label="E-mail" type="email" required />
          <FormField name="phone" label="Телефон" />
          <FormField name="password" label="Пароль (мін. 8)" type="password" required />
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
