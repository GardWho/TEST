import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ CORS local uniquement (pas besoin d'URL externes)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://rg-equitation-education-equine.fr",
  "http://rg-equitation-education-equine.fr",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS bloqué pour :", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ✅ Servir le frontend buildé
app.use(express.static(join(__dirname, "dist")));

// ✅ Toutes les routes non-API → index.html (SPA)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) return;
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { items, deliveryKm, userId, userEmail } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Panier vide" });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { 
          name: item.label,
          metadata: { serviceType: item.serviceType || "prestation" }
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    if (deliveryKm > 15) {
      const fees = (deliveryKm - 15) * 0.50;
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: `Frais de déplacement (${deliveryKm} km)` },
          unit_amount: Math.round(fees * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL || "https://rg-equitation-education-equine.fr"}/compte?success=true`,
      cancel_url: `${process.env.CLIENT_URL || "https://rg-equitation-education-equine.fr"}/panier?canceled=true`,
      metadata: {
        userId: userId || "guest",
        userEmail: userEmail || "guest@email.com",
        deliveryKm: String(deliveryKm || 0),
        items: JSON.stringify(items.map((i) => ({ label: i.label, quantity: i.quantity || 1 }))),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("❌ Erreur Stripe :", error);
    res.status(500).json({ error: error.message || "Erreur interne" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));