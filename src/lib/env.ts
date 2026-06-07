export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const API_URL_SERVER = process.env.API_URL_SERVER ?? API_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://academicbook.kiev.ua"
).replace(/\/+$/, "");
