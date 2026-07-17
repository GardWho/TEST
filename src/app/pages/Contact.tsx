import { useState } from "react";
import { Phone, Mail, ArrowRight, Check } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/flagged/photo-1567367380042-5164565bcca0?w=1400&h=1800&fit=crop&auto=format&q=85";

const contacts = [
  { Icon: Phone, label: "Téléphone", val: "+33 6 52 05 37 78" },
  { Icon: Mail, label: "Email", val: "r.g.connexionequine@gmail.com" },
];

const categories = [
  "Cours",
  "Travail du cheval",
  "Rééducation",
  "Débourrage – Éducation équine",
  "Professionnels",
];

export function Contact() {
  const [form, setForm] = useState({ nom: "", prenom: "", telephone: "", categorie: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://formspree.io/f/mwvjaobj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          telephone: form.telephone,
          categorie: form.categorie,
          message: form.message,
          _subject: "Nouveau message depuis le site RG Connexion Équine",
        }),
      });

      if (response.ok) {
        setSent(true);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F3EC]">
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-10 md:px-20 lg:px-28 pt-32 md:pt-0 pb-20 md:pb-0 order-2 md:order-1">
          <div className="max-w-lg">
            <p className="text-[10px] tracking-[0.45em] uppercase text-[#C09A3C] mb-10">Contact</p>
            <h1 className="text-5xl lg:text-[64px] font-normal leading-[1.04] mb-8 text-[#1C1814]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Prenons<br /><em className="text-[#C09A3C]">contact</em>
            </h1>
            <div className="space-y-6 text-[15px] text-[#1C1814]/60 leading-relaxed font-light">
              <p>Vous avez un projet, une question ou souhaitez réserver une séance ? N'hésitez pas à me contacter par téléphone ou via le formulaire.</p>
              <div className="flex flex-col gap-3">
                {contacts.map(({ Icon, label, val }) => (
                  <div key={label} className="flex items-center gap-4">
                    <Icon size={16} className="text-[#C09A3C] shrink-0" />
                    <div>
                      <p className="text-[9px] tracking-[0.35em] uppercase text-[#C09A3C]/70">{label}</p>
                      <p className="text-[14px] text-[#1C1814]/80">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-[#C09A3C]/15">
                <p className="text-[12px] text-[#1C1814]/40">Du lundi au samedi selon agenda. Réponse sous 48h.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative min-h-[60vw] md:min-h-screen order-1 md:order-2 bg-[#E8DDD0]">
          <img src={HERO_IMG} alt="Cavalière et son cheval — RG Connexion Équine" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#F8F3EC]/20" />
          <div className="absolute bottom-8 left-8 text-[10px] tracking-[0.35em] uppercase text-white/60">RG Connexion Équine</div>
        </div>
      </section>

      <section className="py-24 px-8 md:px-16 max-w-[1400px] mx-auto">
        {sent ? (
          <div className="flex flex-col items-center justify-center text-center gap-8 min-h-[400px]">
            <div className="w-16 h-16 border border-[#C09A3C] flex items-center justify-center">
              <Check size={20} className="text-[#C09A3C]" />
            </div>
            <div>
              <h2 className="text-3xl font-normal text-[#1C1814] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Message envoyé</h2>
              <p className="text-[14px] text-[#1C1814]/50 font-light">Nous reviendrons vers vous dans les meilleurs délais.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {error && <div className="md:col-span-2 p-3 bg-red-50 text-red-600 text-[13px] rounded-sm">{error}</div>}
            <Field label="Nom">
              <input type="text" placeholder="Votre nom" required value={form.nom} onChange={(e) => set("nom", e.target.value)} className="w-full bg-transparent border-b border-[#1C1814]/15 py-3 text-[14px] text-[#1C1814] placeholder:text-[#1C1814]/25 font-light outline-none focus:border-[#C09A3C] transition-colors" />
            </Field>
            <Field label="Prénom">
              <input type="text" placeholder="Votre prénom" required value={form.prenom} onChange={(e) => set("prenom", e.target.value)} className="w-full bg-transparent border-b border-[#1C1814]/15 py-3 text-[14px] text-[#1C1814] placeholder:text-[#1C1814]/25 font-light outline-none focus:border-[#C09A3C] transition-colors" />
            </Field>
            <Field label="Téléphone">
              <input type="tel" placeholder="Votre numéro" required value={form.telephone} onChange={(e) => set("telephone", e.target.value)} className="w-full bg-transparent border-b border-[#1C1814]/15 py-3 text-[14px] text-[#1C1814] placeholder:text-[#1C1814]/25 font-light outline-none focus:border-[#C09A3C] transition-colors" />
            </Field>
            <Field label="Catégorie">
              <select value={form.categorie} onChange={(e) => set("categorie", e.target.value)} className="w-full bg-transparent border-b border-[#1C1814]/15 py-3 text-[14px] font-light outline-none focus:border-[#C09A3C] transition-colors appearance-none cursor-pointer" style={{ color: form.categorie ? "#1C1814" : "rgba(28,24,20,0.25)" }}>
                <option value="">— Choisissez une catégorie —</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Votre message">
                <textarea rows={5} placeholder="Votre demande" required value={form.message} onChange={(e) => set("message", e.target.value)} className="w-full bg-transparent border-b border-[#1C1814]/15 py-3 text-[14px] text-[#1C1814] placeholder:text-[#1C1814]/25 font-light outline-none focus:border-[#C09A3C] transition-colors resize-none" />
              </Field>
            </div>
            <div className="md:col-span-2 pt-4">
              <button type="submit" disabled={loading} className="group w-full flex items-center justify-center gap-3 py-4 bg-[#1C1814] text-[#F8F3EC] text-[11px] tracking-[0.25em] uppercase hover:bg-[#C09A3C] transition-colors duration-300 disabled:opacity-50">
                {loading ? "Envoi en cours..." : "Envoyer"}
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-[11px] text-[#1C1814]/30 mt-4 font-light">Vos données restent confidentielles et ne sont jamais partagées.</p>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40">{label}</label>
      {children}
    </div>
  );
}