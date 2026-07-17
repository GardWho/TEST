import { Handler } from "@netlify/functions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { items, deliveryKm, userId, userEmail } = JSON.parse(event.body!);

    const lineItems = items.map((item: any) => ({
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
      success_url: `${process.env.URL}/compte?success=true`,
      cancel_url: `${process.env.URL}/panier?canceled=true`,
      metadata: {
        userId,
        userEmail,
        deliveryKm: String(deliveryKm),
        items: JSON.stringify(items.map((i: any) => ({ label: i.label, quantity: i.quantity }))),
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};