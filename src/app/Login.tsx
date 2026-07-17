import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegistering) {
        await register(name, email, password);
        alert("Inscription réussie ! Veuillez confirmer votre email pour vous connecter.");
        setIsRegistering(false);
      } else {
        await login(email, password);
        navigate("/compte");
      }
    } catch (err: any) {
      setError(err.message || "Erreur d'authentification");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE4] px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-lg">
        <h1 className="text-3xl font-normal mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          {isRegistering ? "Créer un compte" : "Connexion"}
        </h1>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-[13px] rounded-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-b border-[#1C1814]/15 py-2 text-[14px] outline-none focus:border-[#C09A3C] transition-colors"
              />
            </div>
          )}
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b border-[#1C1814]/15 py-2 text-[14px] outline-none focus:border-[#C09A3C] transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b border-[#1C1814]/15 py-2 text-[14px] outline-none focus:border-[#C09A3C] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#C09A3C] text-white text-[11px] tracking-[0.25em] uppercase hover:bg-[#1C1814] transition-colors"
          >
            {isRegistering ? "S'inscrire" : "Se connecter"}
          </button>
        </form>
        <p className="text-center text-[12px] text-[#1C1814]/40 mt-4">
          {isRegistering ? "Déjà un compte ?" : "Pas encore de compte ?"}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="ml-2 text-[#C09A3C] hover:underline"
          >
            {isRegistering ? "Se connecter" : "S'inscrire"}
          </button>
        </p>
      </div>
    </div>
  );
}