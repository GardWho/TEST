import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useAuth } from "../AuthContext";
import { useCart } from "./CartContext";

// ✅ Contact dans la navbar
const links = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À Propos" },
  { to: "/prestations", label: "Prestations" },
  { to: "/contact", label: "Contact" },
];

// ✅ Sous-menus pour Prestations (au survol)
const prestationsSubMenu = [
  { to: "/cours", label: "Cours" },
  { to: "/travail-cheval", label: "Travail du cheval" },
  { to: "/reeducation", label: "Rééducation" },
  { to: "/education-equine", label: "Débourrage & éducation" },
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { toggleCart, items } = useCart();

  const isTransparentPage = !["/login", "/compte"].includes(location.pathname);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const floating = isTransparentPage && !scrolled;
  const logoSrc = "/images/logo-fblanc.png";
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

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
            {links.map((l) => {
              // ✅ Menu déroulant pour Prestations (au survol)
              if (l.to === "/prestations") {
                return (
                  <div
                    key={l.to}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <NavLink
                      to={l.to}
                      className={({ isActive }) =>
                        `text-[10px] tracking-[0.28em] uppercase transition-all duration-300 flex items-center gap-1 ${
                          floating
                            ? isActive ? "text-white" : "text-white/45 hover:text-white/80"
                            : isActive ? "text-[#C09A3C]" : "text-[#1C1814]/40 hover:text-[#1C1814]/80"
                        }`
                      }
                    >
                      {l.label}
                      <ChevronDown size={12} />
                    </NavLink>
                    {/* Dropdown qui reste ouvert au survol */}
                    {dropdownOpen && (
                      <div
                        className="absolute top-full left-0 mt-1 bg-[#F5EFE4] shadow-lg border border-[#C09A3C]/15 rounded-sm min-w-[200px] py-1"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        {prestationsSubMenu.map((sub) => (
                          <NavLink
                            key={sub.to}
                            to={sub.to}
                            className={({ isActive }) =>
                              `block px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                                isActive
                                  ? "text-[#C09A3C] bg-[#EDE4D0]"
                                  : "text-[#1C1814]/60 hover:text-[#1C1814] hover:bg-[#EDE4D0]/50"
                              }`
                            }
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
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
              );
            })}

            {/* ✅ Panier dans la navbar (pas de widget flottant) */}
            <button
              onClick={toggleCart}
              className={`text-[10px] tracking-[0.28em] uppercase transition-all duration-300 flex items-center gap-2 ${
                floating
                  ? "text-white/45 hover:text-white/80"
                  : "text-[#1C1814]/40 hover:text-[#1C1814]/80"
              }`}
            >
              <ShoppingCart size={16} />
              Panier
              {totalItems > 0 && (
                <span className="bg-[#C09A3C] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

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
            {links.map((l) => {
              if (l.to === "/prestations") {
                return (
                  <div key={l.to} className="flex flex-col gap-3">
                    <NavLink
                      to={l.to}
                      className={({ isActive }) =>
                        `text-[10px] tracking-[0.32em] uppercase ${isActive ? "text-[#C09A3C]" : "text-[#1C1814]/40"}`
                      }
                    >
                      {l.label}
                    </NavLink>
                    <div className="flex flex-col gap-2 pl-4 border-l-2 border-[#C09A3C]/20">
                      {prestationsSubMenu.map((sub) => (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          className={({ isActive }) =>
                            `text-[9px] tracking-[0.25em] uppercase ${isActive ? "text-[#C09A3C]" : "text-[#1C1814]/40"}`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
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
              );
            })}
            <button
              onClick={toggleCart}
              className="text-[10px] tracking-[0.32em] uppercase text-[#1C1814]/40 flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Panier
              {totalItems > 0 && (
                <span className="bg-[#C09A3C] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
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

      {/* ✅ FOOTER AVEC "KP Photographies" et "R.G. ÉQUITATION & ÉDUCATION ÉQUINE" */}
      <footer style={{ background: "#1C1814", borderTop: "1px solid rgba(192,154,60,0.15)" }}>
        <div className="max-w-[1500px] mx-auto px-8 md:px-14 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <img
              src="/images/logo-fnoir.png"
              alt="R.G. ÉQUITATION & ÉDUCATION ÉQUINE"
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-[12px] tracking-wider" style={{ color: "rgba(245,239,228,0.3)" }}>
              © 2024 R.G. ÉQUITATION & ÉDUCATION ÉQUINE
            </p>
            <p className="text-[11px] tracking-wider mt-1" style={{ color: "rgba(245,239,228,0.35)" }}>
              SIRET 978 982 866 00011
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-wider" style={{ color: "rgba(245,239,228,0.25)" }}>
              Crédit photo : <span className="text-[#C09A3C]/60">KP Photographies</span>
            </p>
            <a
              href="https://www.instagram.com/photographies_kp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-wider hover:text-[#C09A3C] transition-colors"
              style={{ color: "rgba(245,239,228,0.3)" }}
            >
              @photographies_kp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}