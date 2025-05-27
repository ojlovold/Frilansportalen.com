// pages/admin-bypass.tsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminBypass() {
  const [email, setEmail] = useState("");
  const [kode, setKode] = useState("");
  const [feil, setFeil] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "ole@frilansportalen.com" && kode === "@Bente01") {
      localStorage.setItem("admin", "true");
      router.push("/admin");
    } else {
      setFeil("Feil e-post eller kode");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 text-black p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Bypass</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Kode"
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-black text-yellow-300 py-2 px-4 rounded font-semibold"
        >
          Gå inn som admin
        </button>
        {feil && <p className="text-red-600">{feil}</p>}
      </form>
    </main>
  );
}
