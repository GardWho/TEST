import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../AuthContext";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À Propos" },
  { to: "/prestations", label: "Prestations" },
  { to: "/contact", label: "Contact" },
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isTransparentPage = !["/login", "/compte"].includes(location.pathname);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const floating = isTransparentPage && !scrolled;

  // ✅ LOGO FIXE : toujours le blanc (même en défilant)
  const logoSrc = "/images/logo-fblanc.png";

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Jost', sans-serif", background: "#F5EFE4" }}>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-600"
        style={{
          background: floating ? "transparent" : "rgba(245,239,228,0.97)",
          backdropFilter: floating ? "none" : "blur(16px)",
          borderBottom: floating ? "none" : "1px solid rgba(192,154,60,0.12)",
        }}
      >
        <div className="max-w-[1500px] mx-auto px-8 md:px-14 h-[68px] flex items-center justify-between">
          <NavLink to="/" className="flex items-center">
            <img
              src={logoSrc}
              alt="RG Équitation & Éducation Équine"
              className="h-10 w-auto object-contain"
            />
          </NavLink>

          <div className="hidden md:flex items-center gap-9">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `text-[10px] tracking-[0.28em] uppercase transition-all duration-300 ${
                    floating
                      ? isActive ? "text-white" : "text-white/45 hover:text-white/80"
                      : isActive ? "text-[#C09A3C]" : "text-[#1C1814]/40 hover:text-[#1C1814]/80"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <NavLink
                to="/compte"
                className="text-[10px] tracking-[0.28em] uppercase px-5 py-2 transition-all duration-300"
                style={{
                  border: `1px solid ${floating ? "rgba(245,239,228,0.3)" : "rgba(192,154,60,0.4)"}`,
                  color: floating ? "#FFFFFF" : "#C09A3C",
                }}
              >
                Mon compte
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="text-[10px] tracking-[0.28em] uppercase px-5 py-2 transition-all duration-300"
                style={{
                  border: `1px solid ${floating ? "rgba(245,239,228,0.3)" : "rgba(192,154,60,0.4)"}`,
                  color: floating ? "#F5EFE4" : "#C09A3C",
                }}
              >
                Connexion
              </NavLink>
            )}
          </div>

          <button
            className="md:hidden"
            style={{ color: floating ? "#F5EFE4" : "#1C1814" }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div
            className="md:hidden px-8 py-8 flex flex-col gap-7 border-t"
            style={{ background: "#F5EFE4", borderColor: "rgba(192,154,60,0.12)" }}
          >
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `text-[10px] tracking-[0.32em] uppercase ${isActive ? "text-[#C09A3C]" : "text-[#1C1814]/40"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <NavLink to="/compte" className="text-[10px] tracking-[0.32em] uppercase text-[#C09A3C]">
                Mon compte
              </NavLink>
            ) : (
              <NavLink to="/login" className="text-[10px] tracking-[0.32em] uppercase text-[#C09A3C]">
                Connexion
              </NavLink>
            )}
          </div>
        )}
      </nav>

      <main><Outlet /></main>

      {/* ✅ FOOTER HORIZONTAL avec gauche/centre/droite */}
      <footer style={{ background: "#1C1814", borderTop: "1px solid rgba(192,154,60,0.15)" }}>
        <div className="max-w-[1500px] mx-auto px-8 md:px-14 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Gauche : Logo */}
          <div className="flex items-center">
            <img
              src="/images/logo-fnoir.png"
              alt="RG Connexion Équine"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Centre : Année + SIRET */}
          <div className="text-center">
            <p className="text-[10px] tracking-wider" style={{ color: "rgba(245,239,228,0.25)" }}>
              © 2024 RG Équitation & Éducation Équine
            </p>
            <p className="text-[10px] tracking-wider" style={{ color: "rgba(245,239,228,0.3)" }}>
              SIRET 978 982 866 00011
            </p>
          </div>

          {/* Droite : Crédit photo + Instagram */}
          <div className="text-right">
            <p className="text-[9px] tracking-wider" style={{ color: "rgba(245,239,228,0.2)" }}>
              Crédit photo : <span className="text-[#C09A3C]/60">Kelline</span>
            </p>
            <a
              href="https://www.instagram.com/kelline"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] tracking-wider hover:text-[#C09A3C] transition-colors"
              style={{ color: "rgba(245,239,228,0.3)" }}
            >
              @kelline
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}