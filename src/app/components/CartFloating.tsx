import { useCart } from "./CartContext";
import { ShoppingCart, X, Loader2 } from "lucide-react";

export function CartFloating() {
  const {
    items,
    total,
    totalWithDelivery,
    isOpen,
    toggleCart,
    removeItem,
    deliveryKm,
    setDeliveryKm,
    proceedToCheckout,
    loading,
  } = useCart();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <button
        onClick={toggleCart}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#C09A3C] text-white rounded-full shadow-xl hover:bg-[#1C1814] transition-colors duration-300"
      >
        <ShoppingCart size={18} />
        {totalItems > 0 && (
          <span className="bg-white text-[#C09A3C] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={toggleCart} />
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#F5EFE4] shadow-2xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-[#C09A3C]/15">
            <h2 className="text-xl font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
              Panier
            </h2>
            <button onClick={toggleCart} className="text-[#1C1814]/60 hover:text-[#1C1814]">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1" style={{ maxHeight: "calc(100vh - 180px)" }}>
            {items.length === 0 ? (
              <p className="text-[#1C1814]/40 text-center mt-8">Votre panier est vide.</p>
            ) : (
              <>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4 border-b border-[#C09A3C]/10 pb-4">
                      <div>
                        <p className="text-[14px] text-[#1C1814] font-medium">{item.label}</p>
                        <p className="text-[12px] text-[#1C1814]/40">
                          {item.price} € × {item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#C09A3C] hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[#C09A3C]/15">
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40">
                      Kilomètres (au-delà de 15 km)
                    </label>
                    <input
                      type="number"
                      value={deliveryKm}
                      onChange={(e) => setDeliveryKm(Number(e.target.value))}
                      className="w-20 border-b border-[#C09A3C]/25 py-1 text-[14px] text-center outline-none focus:border-[#C09A3C]"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span>Sous-total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                  {deliveryKm > 15 && (
                    <div className="flex justify-between text-[13px] text-[#1C1814]/60 mt-1">
                      <span>Frais de déplacement ({(deliveryKm - 15) * 0.35} €)</span>
                      <span>{((deliveryKm - 15) * 0.35).toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[18px] font-medium mt-4 pt-4 border-t border-[#C09A3C]/15">
                    <span>Total</span>
                    <span className="text-[#C09A3C]">{totalWithDelivery.toFixed(2)} €</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {items.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#F5EFE4] border-t border-[#C09A3C]/15">
              <button
                onClick={proceedToCheckout}
                disabled={loading}
                className="w-full py-3 bg-[#C09A3C] text-white text-[11px] tracking-[0.25em] uppercase hover:bg-[#1C1814] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Traitement...
                  </>
                ) : (
                  `Payer ${totalWithDelivery.toFixed(2)} €`
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}