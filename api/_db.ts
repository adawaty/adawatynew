import { neon } from "@neondatabase/serverless";

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL env var");
  return neon(url);
}

export function getAdminToken() {
  const token = process.env.ADMIN_TOKEN;
  if (!token) throw new Error("Missing ADMIN_TOKEN env var");
  return token;
}
