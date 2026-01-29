import { Redirect } from "expo-router";
import { useAppSelector } from "@/store/hooks";

export default function Index() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Redirect to landing page first
  // Users can then navigate to login/register or tabs from there
  return <Redirect href="/landing" />;
}

