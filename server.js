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

app.use(cors());
app.use(express.json());

// En production, servir les fichiers du frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "dist", "index.html"));
  });
}

// Route API
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { items, deliveryKm, userId, userEmail } = req.body;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.label },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (deliveryKm > 15) {
      const fees = (deliveryKm - 15) * 0.35;
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
      success_url: `${process.env.CLIENT_URL || "https://votre-domaine.com"}/compte?success=true`,
      cancel_url: `${process.env.CLIENT_URL || "https://votre-domaine.com"}/panier?canceled=true`,
      metadata: {
        userId,
        userEmail,
        deliveryKm: String(deliveryKm),
        items: JSON.stringify(items.map((i) => ({ label: i.label, quantity: i.quantity }))),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Erreur Stripe :", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));