"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { setAuthState } from "@/store/slices/authSlice";

function AuthBootstrap() {
  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        const data = await response.json();
        if (data?.user?.email) {
          store.dispatch(setAuthState({ isAuthenticated: true, email: data.user.email }));
          return;
        }
      } catch {
        // Ignore and default to logged-out state.
      }

      store.dispatch(setAuthState({ isAuthenticated: false, email: null }));
    };

    run();
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
}
