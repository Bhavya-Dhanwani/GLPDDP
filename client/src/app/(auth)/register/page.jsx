import RegisterPageClient from "@/features/auth/ui/jsx/RegisterPageClient";

export const metadata = {
  title: "Create Account — GLPDDP",
  description: "Sign up to manage your cricket league on GLPDDP.",
};

// Server Component — just renders the client shell.
// All heavy chunks (Hero, Form, GoogleG) are dynamically imported
// inside RegisterPageClient and downloaded only when needed.
export default function RegisterPage() {
  return <RegisterPageClient />;
}
