const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface Tokens {
  access: string;
  refresh: string;
}

export function getTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("404pnf_tokens");
  return raw ? (JSON.parse(raw) as Tokens) : null;
}

export function setTokens(tokens: Tokens) {
  localStorage.setItem("404pnf_tokens", JSON.stringify(tokens));
}

export function clearTokens() {
  localStorage.removeItem("404pnf_tokens");
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens?.refresh) return null;

  const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = await res.json();
  const newTokens: Tokens = { access: data.access, refresh: data.refresh ?? tokens.refresh };
  setTokens(newTokens);
  return newTokens.access;
}

/**
 * সব API কলে এটা ব্যবহার করুন — token attach + expired হলে auto-refresh করে দেয়।
 * এখন এটা generic <T> — response.json() পার্স করে সরাসরি T টাইপের ডেটা রিটার্ন করে।
 * body যদি FormData হয়, Content-Type header নিজে থেকে সেট করে না (browser নিজেই
 * সঠিক multipart/form-data; boundary=... বসিয়ে দেয়)।
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const tokens = getTokens();
  const headers = new Headers(options.headers);

  // FormData হলে Content-Type নিজে সেট করবেন না — browser নিজে boundary সহ বসায়
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (tokens?.access) headers.set("Authorization", `Bearer ${tokens.access}`);

  let response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401 && tokens?.refresh) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      headers.set("Authorization", `Bearer ${newAccess}`);
      response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    }
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(errText || `Request failed with status ${response.status}`);
  }

  // 204 No Content (যেমন DELETE) এর ক্ষেত্রে body খালি থাকে, JSON পার্স করলে crash করবে
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export { API_BASE_URL };