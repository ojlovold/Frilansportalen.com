export default function LoginHelper() {
  const handleLogin = () => {
    localStorage.setItem("user_email", "admin@frilansportalen.com");
    alert("Logget inn som admin!");
    window.location.reload();
  };

  return (
    <button onClick={handleLogin} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
      Logg inn som admin
    </button>
  );
}
