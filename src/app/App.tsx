import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "../AuthContext";
import { CartProvider } from "./components/CartContext";
import { LocalBusinessSchema } from "./components/SEO";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LocalBusinessSchema />
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}