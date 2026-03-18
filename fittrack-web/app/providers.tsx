"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { setAuthState } from "@/store/slices/authSlice";
import { authClient } from "@/src/lib/auth-client";

function AuthBootstrap() {
  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await authClient.getSession();
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
