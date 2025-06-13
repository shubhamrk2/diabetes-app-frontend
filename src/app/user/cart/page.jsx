'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const {
    cartItems,
    getCartTotal,
    clearCart,
    loading,
    error,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const isCartEmpty = cartItems.length === 0;
  const total = getCartTotal();
  const formattedTotal = typeof total === 'number' ? total.toFixed(2) : '0.00';

  return (
    <div className="lg:col-span-1 p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
        <h3 className="text-xl font-bold mb-4">Cart Summary</h3>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded" role="alert">
            {error}
          </div>
        )}

        <div className="flex justify-between mb-4">
          <span>
            Total ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''}):
          </span>
          <span className="font-semibold">₹{formattedTotal}</span>
        </div>

        <div className="space-y-3">
          {isCartEmpty ? (
            <button
              type="button"
              disabled
              className="w-full bg-green-600 text-white py-2 px-4 rounded opacity-50 cursor-not-allowed"
              aria-disabled="true"
            >
              Proceed to Checkout
            </button>
          ) : (
            <Link
              href="/user/checkout"
              className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Proceed to Checkout
            </Link>
          )}

          <button
            type="button"
            aria-label="Clear all items from cart"
            onClick={clearCart}
            disabled={isCartEmpty || loading}
            className={`w-full border border-red-600 text-red-600 py-2 px-4 rounded transition-colors ${
              isCartEmpty || loading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400'
            }`}
          >
            Clear Cart
          </button>
        </div>

        {!isCartEmpty && (
          <div className="mt-6 space-y-4">
            {cartItems.map(({ productId, name, price, quantity, imageUrl }) => (
              <div key={productId} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="h-12 w-12 object-cover rounded"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <h4 className="font-medium">{name}</h4>
                    <p>₹{price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updateQuantity(productId, Math.max(1, quantity - 1))
                    }
                    disabled={loading}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    aria-label={`Decrease quantity of ${name}`}
                  >
                    -
                  </button>

                  <span aria-live="polite" aria-atomic="true">{quantity}</span>

                  <button
                    onClick={() => updateQuantity(productId, quantity + 1)}
                    disabled={loading}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    aria-label={`Increase quantity of ${name}`}
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(productId)}
                    disabled={loading}
                    className="ml-4 text-red-600 hover:text-red-800"
                    aria-label={`Remove ${name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
