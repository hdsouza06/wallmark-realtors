import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import Seo from "../../components/Seo";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-5">
      <Seo title="Admin Login" />
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-luxe sm:p-10">
        <div className="mb-8 flex justify-center">
          <Logo height="h-24" />
        </div>
        <h1 className="text-center text-2xl font-semibold text-navy-900">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-gray-500">Sign in to manage your website.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input-luxe" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input-luxe" />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button disabled={busy} className="btn-gold w-full">
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
