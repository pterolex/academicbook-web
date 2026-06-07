"use client";
import { ErrorMessage, useField } from "formik";

const inputStyle = {
  borderColor: "var(--ab-border)",
  background: "var(--ab-paper)",
} as const;

const inputClass = "w-full border px-3 py-2 rounded-sm";

export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}

// Single Formik field: label + input/textarea + error message. Used by every
// form (login, register, checkout) so field markup lives in one place.
export function FormField({
  name,
  label,
  type = "text",
  required = false,
  textarea = false,
}: FormFieldProps) {
  const [field] = useField(name);
  return (
    <label className="block text-sm">
      <span className="block mb-1">
        {label} {required && <span style={{ color: "#c0392b" }}>*</span>}
      </span>
      {textarea ? (
        <textarea {...field} rows={3} className={inputClass} style={inputStyle} />
      ) : (
        <input {...field} type={type} className={inputClass} style={inputStyle} />
      )}
      <ErrorMessage name={name} component="div" className="text-xs text-red-600" />
    </label>
  );
}
