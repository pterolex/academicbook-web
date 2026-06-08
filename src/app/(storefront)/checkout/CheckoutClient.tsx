"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { useApi } from "@/hooks/useApi";
import { FormField } from "@/components/FormField";

type DeliveryType = "pickup" | "novaposhta";

interface Values {
  name: string;
  surname: string;
  fatherName: string;
  email: string;
  phone: string;
  deliveryType: DeliveryType;
  city: string;
  warehouse: string;
  notes: string;
  createAccount: boolean;
  password: string;
}

const Schema = Yup.object({
  name: Yup.string().required("Обов'язково"),
  surname: Yup.string().required("Обов'язково"),
  fatherName: Yup.string().max(120),
  email: Yup.string().email("Невірний e-mail").required("Обов'язково"),
  phone: Yup.string().required("Обов'язково"),
  deliveryType: Yup.string()
    .oneOf(["pickup", "novaposhta"])
    .required("Обов'язково"),
  city: Yup.string().when("deliveryType", {
    is: "novaposhta",
    then: (s) => s.required("Обов'язково"),
    otherwise: (s) => s.notRequired(),
  }),
  warehouse: Yup.string().when("deliveryType", {
    is: "novaposhta",
    then: (s) => s.required("Обов'язково"),
    otherwise: (s) => s.notRequired(),
  }),
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
  const api = useApi();
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  if (items.length === 0) {
    return (
      <p>
        Кошик порожній. <Link href="/">Повернутись до каталогу</Link>.
      </p>
    );
  }

  const initial: Values = {
    name: user?.name ?? "",
    surname: user?.surname ?? "",
    fatherName: user?.fatherName ?? "",
    email: user?.email ?? "",
    phone: "",
    deliveryType: "pickup",
    city: "",
    warehouse: "",
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
          const recaptchaToken = executeRecaptcha
            ? await executeRecaptcha("checkout")
            : "";
          const order = await api.orders.create({
            name: values.name,
            surname: values.surname,
            fatherName: values.fatherName || undefined,
            email: values.email,
            phone: values.phone,
            deliveryType: values.deliveryType,
            city:
              values.deliveryType === "novaposhta" ? values.city : undefined,
            warehouse:
              values.deliveryType === "novaposhta"
                ? values.warehouse
                : undefined,
            notes: values.notes || undefined,
            createAccountPassword:
              !user && values.createAccount ? values.password : undefined,
            items: items.map((i) => ({ code: i.code, qty: i.qty })),
            recaptchaToken,
          });
          clear();
          router.push(`/checkout/success?code=${order.code}`);
        } catch (e) {
          helpers.setStatus((e as Error).message || "Помилка оформлення");
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
          <FormField name="surname" label="Прізвище" required />
          <FormField name="name" label="Ім'я" required />
          <FormField name="fatherName" label="По батькові" />
          <FormField name="email" label="E-mail" type="email" required />
          <FormField name="phone" label="Телефон" required />

          <div className="text-sm space-y-1">
            <span className="block mb-1">
              Спосіб доставки <span style={{ color: "#c0392b" }}>*</span>
            </span>
            <label className="flex items-center gap-2">
              <Field type="radio" name="deliveryType" value="pickup" />
              Самовивоз
            </label>
            <label className="flex items-center gap-2">
              <Field type="radio" name="deliveryType" value="novaposhta" />
              Нова пошта
            </label>
          </div>

          {values.deliveryType === "novaposhta" && (
            <>
              <FormField name="city" label="Місто" required />
              <FormField name="warehouse" label="Відділення" required />
            </>
          )}

          <FormField name="notes" label="Примітки" textarea />

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
                <FormField name="password" label="Пароль (мін. 8 символів)" type="password" required />
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
