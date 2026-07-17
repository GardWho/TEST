import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./components/CartContext";
import { CartFloating } from "./components/CartFloating";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <CartFloating />
      </CartProvider>
    </AuthProvider>
  );
}