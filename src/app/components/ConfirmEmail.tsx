import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { config } from "../../config";

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

export function ConfirmEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfirmation = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");
      const tokenHash = hashParams.get("token_hash");
      const type = hashParams.get("type");

      if (error) {
        alert(`Erreur : ${errorDescription || "Lien invalide ou expiré"}`);
        navigate("/login");
        return;
      }

      if (tokenHash && type === "signup") {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "signup",
        });

        if (verifyError) {
          alert("La confirmation a échoué. Le lien a peut-être expiré.");
        } else {
          alert("Email confirmé ! Vous pouvez maintenant vous connecter.");
        }
      }

      navigate("/login");
    };

    handleConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE4]">
      <p className="text-[15px] text-[#1C1814]/60">
        Confirmation de votre email en cours...
      </p>
    </div>
  );
}