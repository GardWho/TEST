import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useCart } from "./CartContext";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À Propos" },
  { to: "/prestations", label: "Prestations" },
  { to: "/contact", label: "Contact" },
];

const prestationsSubMenu = [
  { to: "/cours", label: "Cours" },
  { to: "/travail-cheval", label: "Travail du cheval" },
  { to: "/reeducation", label: "Rééducation" },
  { to: "/education-equine", label: "Débourrage & éducation" },
];

// Icônes SVG inline
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { items } = useCart();

  const isTransparentPage = !["/login", "/compte", "/panier"].includes(location.pathname);
  const isDarkTextPage = ["/a-propos", "/contact"].includes(location.pathname);

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
  const logoSrc = floating ? "/images/logo-fblanc.png" : "/images/logo-fnoir.png";
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // ✅ Nouvelle logique de couleur
  const getTextColor = (isActive: boolean) => {
    // Si le lien est actif → toujours doré
    if (isActive) return "text-[#C09A3C]";
    
    // Si on est sur une page "texte noir" (À propos ou Contact)
    if (isDarkTextPage) {
    // TOUJOURS noir, même quand floating (fond transparent)
    return "text-[#1C1814]/70 hover:text-[#1C1814]";
  }
  
    
    // Comportement normal
    if (floating) return "text-white/45 hover:text-white/80";
    return "text-[#1C1814]/40 hover:text-[#1C1814]/80";
  };

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
            <img src={logoSrc} alt="RG Équitation & Éducation Équine" className="h-10 w-auto object-contain" />
          </NavLink>

          <div className="hidden md:flex items-center gap-9">
            {links.map((l) => {
              if (l.to === "/prestations") {
                return (
// ✅ Augmenter le délai de fermeture du dropdown
<div
  key={l.to}
  className="relative"
  onMouseEnter={() => setDropdownOpen(true)}
  onMouseLeave={() => {
    // ✅ Augmenté à 1200ms pour que le dropdown reste plus longtemps
    setTimeout(() => {
      setDropdownOpen(false);
    }, 1200);
  }}
>
                    <NavLink
                      to={l.to}
                      className={({ isActive }) =>
                        `text-[10px] tracking-[0.28em] uppercase transition-all duration-300 flex items-center gap-1 ${getTextColor(isActive)}`
                      }
                    >
                      {l.label}
                      <ChevronDownIcon />
                    </NavLink>
                    {dropdownOpen && (
                      <div
                        className="absolute top-full left-0 mt-1 bg-[#F5EFE4] shadow-lg border border-[#C09A3C]/15 rounded-sm min-w-[200px] py-1 z-50"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        {prestationsSubMenu.map((sub) => (
                          <NavLink
                            key={sub.to}
                            to={sub.to}
                            className={({ isActive }) =>
                              `block px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-[#EDE4D0] ${
                                isActive
                                  ? "text-[#C09A3C] bg-[#EDE4D0]"
                                  : isDarkTextPage
                                  ? "text-[#1C1814]/70 hover:text-[#1C1814]"
                                  : "text-[#1C1814]/60 hover:text-[#1C1814]"
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
                    `text-[10px] tracking-[0.28em] uppercase transition-all duration-300 ${getTextColor(isActive)}`
                  }
                >
                  {l.label}
                </NavLink>
              );
            })}

            <NavLink
              to="/panier"
              className={({ isActive }) =>
                `text-[10px] tracking-[0.28em] uppercase transition-all duration-300 flex items-center gap-2 ${getTextColor(isActive)}`
              }
            >
              <CartIcon />
              Panier
              {totalItems > 0 && (
                <span className="bg-[#C09A3C] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </NavLink>

            {user ? (
              <NavLink
                to="/compte"
                className={({ isActive }) =>
                  `text-[10px] tracking-[0.28em] uppercase px-5 py-2 transition-all duration-300 border ${
                    isActive ? "border-[#C09A3C] text-[#C09A3C]" : `border-[#C09A3C]/40 ${getTextColor(false)}`
                  }`
                }
              >
                Mon compte
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-[10px] tracking-[0.28em] uppercase px-5 py-2 transition-all duration-300 border ${
                    isActive ? "border-[#C09A3C] text-[#C09A3C]" : `border-[#C09A3C]/40 ${getTextColor(false)}`
                  }`
                }
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
            {open ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        {open && (
          <div className="md:hidden px-8 py-8 flex flex-col gap-7 border-t" style={{ background: "#F5EFE4", borderColor: "rgba(192,154,60,0.12)" }}>
            {links.map((l) => {
              if (l.to === "/prestations") {
                return (
                  <div key={l.to} className="flex flex-col gap-3">
                    <NavLink to={l.to} className={({ isActive }) => `text-[10px] tracking-[0.32em] uppercase ${isActive ? "text-[#C09A3C]" : isDarkTextPage ? "text-[#1C1814]/70" : "text-[#1C1814]/40"}`}>
                      {l.label}
                    </NavLink>
                    <div className="flex flex-col gap-2 pl-4 border-l-2 border-[#C09A3C]/20">
                      {prestationsSubMenu.map((sub) => (
                        <NavLink key={sub.to} to={sub.to} className={({ isActive }) => `text-[9px] tracking-[0.25em] uppercase ${isActive ? "text-[#C09A3C]" : isDarkTextPage ? "text-[#1C1814]/70" : "text-[#1C1814]/40"}`}>
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => `text-[10px] tracking-[0.32em] uppercase ${isActive ? "text-[#C09A3C]" : isDarkTextPage ? "text-[#1C1814]/70" : "text-[#1C1814]/40"}`}>
                  {l.label}
                </NavLink>
              );
            })}
            <NavLink to="/panier" className={({ isActive }) => `text-[10px] tracking-[0.32em] uppercase flex items-center gap-2 ${isActive ? "text-[#C09A3C]" : isDarkTextPage ? "text-[#1C1814]/70" : "text-[#1C1814]/40"}`}>
              <CartIcon /> Panier
              {totalItems > 0 && <span className="bg-[#C09A3C] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>}
            </NavLink>
            {user ? (
              <NavLink to="/compte" className="text-[10px] tracking-[0.32em] uppercase text-[#C09A3C]">Mon compte</NavLink>
            ) : (
              <NavLink to="/login" className="text-[10px] tracking-[0.32em] uppercase text-[#C09A3C]">Connexion</NavLink>
            )}
          </div>
        )}
      </nav>

      <main><Outlet /></main>

      <footer style={{ background: "#1C1814", borderTop: "1px solid rgba(192,154,60,0.15)" }}>
        <div className="max-w-[1500px] mx-auto px-8 md:px-14 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <img src="/images/logo-fnoir.png" alt="R.G. ÉQUITATION & ÉDUCATION ÉQUINE" className="h-12 w-auto object-contain" />
          </div>
          <div className="text-center">
            <p className="text-[9px] tracking-wider" style={{ color: "rgba(245,239,228,0.3)" }}>SUIVEZ-NOUS SUR INSTAGRAM</p>
<a href="https://www.instagram.com/rgequitationeducationequine" target="_blank" rel="noopener noreferrer" className="text-[9px] font-light text-[#C09A3C]">
  @rgequitationeducationequine
</a>
            <p className="text-[9px] tracking-wider" style={{ color: "rgba(245,239,228,0.3)" }}>© 2023 R.G. ÉQUITATION & ÉDUCATION ÉQUINE</p>
            <p className="text-[9px] tracking-wider mt-1" style={{ color: "rgba(245,239,228,0.35)" }}>SIRET 978 982 866 00011</p>
          </div>
          <div className="text-right">
            <p className="text-[7px] tracking-wider" style={{ color: "rgba(245,239,228,0.25)" }}>Crédit photo : <span className="text-[#C09A3C]/60">KP Photographies</span></p>
            <a href="https://www.instagram.com/photographies_kp/" target="_blank" rel="noopener noreferrer" className="text-[7px] tracking-wider hover:text-[#C09A3C] transition-colors" style={{ color: "rgba(245,239,228,0.3)" }}>@photographies_kp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}