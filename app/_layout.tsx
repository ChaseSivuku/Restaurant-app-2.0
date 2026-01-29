import { Slot } from "expo-router";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { login, logout } from "@/store/slices/authSlice";
import { authService } from "@/services/supabase/auth";

function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check initial auth state
    authService.getCurrentUser().then((user) => {
      if (user) {
        dispatch(login(user));
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      if (user) {
        dispatch(login(user));
      } else {
        dispatch(logout());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return null;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthListener />
      <Slot />
    </Provider>
  );
}
