import { cookies } from "next/headers";
import { DEMO_USER } from "./seed";
import { DEMO_SESSION_VALUE, SESSION_COOKIE } from "./session";

export { DEMO_SESSION_VALUE, SESSION_COOKIE };

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === DEMO_SESSION_VALUE;
}

export function verifyCredentials(email: string, password: string) {
  const expectedPassword = process.env.CI_DEMO_PASSWORD ?? DEMO_USER.passwordHash;
  return email.trim().toLowerCase() === DEMO_USER.email && password === expectedPassword;
}
