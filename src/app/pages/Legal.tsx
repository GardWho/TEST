import { Link } from "react-router-dom";

const containerStyle = "max-w-3xl mx-auto px-8 py-16 bg-[#F5EFE4] min-h-screen";
const titleStyle = "text-3xl font-normal mb-8 text-[#1C1814]";
const subtitleStyle = "text-xl font-normal mt-8 mb-4 text-[#1C1814]";
const textStyle = "text-[15px] text-[#1C1814]/70 leading-relaxed mb-4";
const linkStyle = "text-[#C09A3C] hover:text-[#1C1814] transition-colors";

export function MentionsLegalesPage() {
  return (
    <div className={containerStyle}>
      <h1 className={titleStyle}>Mentions légales</h1>
      <p className={textStyle}>Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi.</p>

      <h2 className={subtitleStyle}>Éditeur du site</h2>
      <p className={textStyle}>
        <strong>R.G. ÉQUITATION & ÉDUCATION ÉQUINE</strong><br />
        SIRET : 978 982 866 00011<br />
        Email : contact@rg-equitation-education-equine.fr<br />
        Téléphone : +33 6 52 05 37 78<br />
        Adresse : 24 rue Minvielle, Bordeaux, France
      </p>

      <h2 className={subtitleStyle}>Hébergeur</h2>
      <p className={textStyle}>
        IONOS SE<br />
        Elgendorfer Straße 57, 56410 Montabaur, Allemagne<br />
        Site web : ionos.fr
      </p>

      <h2 className={subtitleStyle}>Directeur de la publication</h2>
      <p className={textStyle}>R.G. ÉQUITATION & ÉDUCATION ÉQUINE</p>

      <h2 className={subtitleStyle}>Contact</h2>
      <p className={textStyle}>
        Pour toute question ou réclamation, vous pouvez nous contacter à l'adresse : contact@rg-equitation-education-equine.fr
      </p>

      <p className="mt-8"><Link to="/" className={linkStyle}>← Retour à l'accueil</Link></p>
    </div>
  );
}

export function ConfidentialitePage() {
  return (
    <div className={containerStyle}>
      <h1 className={titleStyle}>Politique de confidentialité</h1>
      <p className={textStyle}>Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre site. Nous respectons le Règlement Général sur la Protection des Données (RGPD).</p>

      <h2 className={subtitleStyle}>1. Données collectées</h2>
      <p className={textStyle}>
        Nous collectons les données suivantes :
        - Nom et prénom (lors de la création de compte)
        - Adresse email (obligatoire pour le compte)
        - Numéro de téléphone (via le formulaire de contact)
        - Historique de réservations et crédits
        - Données de paiement via Stripe (nous ne stockons pas vos informations bancaires)
      </p>

      <h2 className={subtitleStyle}>2. Utilisation des données</h2>
      <p className={textStyle}>
        Vos données sont utilisées pour :
        - Gérer votre compte et vos réservations
        - Vous envoyer des confirmations de réservation
        - Répondre à vos demandes via le formulaire de contact
        - Assurer le fonctionnement du site et sa sécurité
      </p>

      <h2 className={subtitleStyle}>3. Cookies</h2>
      <p className={textStyle}>
        Nous utilisons un cookie de session strictement nécessaire au fonctionnement du service (authentification). Ce cookie ne permet pas de vous identifier en dehors du site. Conformément au RGPD, les cookies strictement nécessaires ne nécessitent pas de consentement.
      </p>

      <h2 className={subtitleStyle}>4. Durée de conservation</h2>
      <p className={textStyle}>
        Vos données sont conservées tant que votre compte est actif. Si vous supprimez votre compte, vos données sont supprimées sous 30 jours.
      </p>

      <h2 className={subtitleStyle}>5. Vos droits</h2>
      <p className={textStyle}>
        Vous disposez d'un droit d'accès, de rectification, de suppression, de portabilité et d'opposition sur vos données. Pour exercer ces droits, contactez-nous à : contact@rg-equitation-education-equine.fr
      </p>

      <h2 className={subtitleStyle}>6. Sécurité</h2>
      <p className={textStyle}>
        Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données. Les paiements sont traités par Stripe, qui est certifié PCI-DSS.
      </p>

      <h2 className={subtitleStyle}>7. Contact</h2>
      <p className={textStyle}>
        Pour toute question concernant cette politique, contactez-nous à : contact@rg-equitation-education-equine.fr
      </p>

      <p className="mt-8"><Link to="/" className={linkStyle}>← Retour à l'accueil</Link></p>
    </div>
  );
}