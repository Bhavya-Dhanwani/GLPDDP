import LoginPageClient from "@/features/auth/ui/jsx/LoginPageClient";

export const metadata = {
  title: "Sign In — GLPDDP",
  description: "Login to your GLPDDP cricket league account.",
};

// Server Component — renders the client shell.
// Hero and Form are dynamically imported inside LoginPageClient.
export default function LoginPage() {
  return <LoginPageClient />;
}
