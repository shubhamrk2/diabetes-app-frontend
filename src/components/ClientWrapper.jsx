"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export default function ClientWrapper({ children }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
