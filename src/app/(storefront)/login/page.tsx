"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/store/auth";
import { useApi } from "@/hooks/useApi";
import { FormField } from "@/components/FormField";

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
  const api = useApi();
  const router = useRouter();

  return (
    <Formik<Values>
      initialValues={{ email: "", password: "" }}
      validationSchema={Schema}
      onSubmit={async (values, helpers) => {
        helpers.setStatus(null);
        try {
          const { accessToken, user } = await api.auth.login(values);
          setAuth({ accessToken, user });
          router.push("/account");
        } catch (e) {
          helpers.setStatus((e as Error).message || "Невірні дані");
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className="space-y-3 max-w-md">
          <h1 className="text-xl">Вхід</h1>
          {status && <div style={{ color: "#c0392b" }}>{status}</div>}
          <FormField name="email" label="E-mail" type="email" required />
          <FormField name="password" label="Пароль" type="password" required />
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
