export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  const email = localStorage.getItem("user_email");
  return email === "admin@frilansportalen.com";
}
