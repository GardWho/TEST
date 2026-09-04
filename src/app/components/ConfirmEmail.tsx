import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { config } from "../../config";

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

export function ConfirmEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleConfirmation = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (token && type === "signup") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        });

        if (error) {
          console.error("Erreur de confirmation:", error.message);
          alert("La confirmation a échoué. Le lien a peut-être expiré.");
        } else {
          alert("Email confirmé ! Vous pouvez maintenant vous connecter.");
        }
      } else {
        alert("Lien de confirmation invalide.");
      }

      navigate("/login");
    };

    handleConfirmation();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE4]">
      <p className="text-[15px] text-[#1C1814]/60">
        Confirmation de votre email en cours...
      </p>
    </div>
  );
}