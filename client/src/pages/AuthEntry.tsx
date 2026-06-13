import { FormEvent, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import siteLogo from "@/assets/logo.jpg";
import headerBackground from "@/assets/header1.png";

export default function AuthEntry() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const utils = trpc.useUtils();
  const localAccess = trpc.auth.localAccess.useMutation({
    onSuccess: async (data, variables) => {
      if (variables.mode === "signup") {
        setMode("login");
        setName("");
        setSuccessMessage("Account created. Login with your email to continue.");
        return;
      }

      setSuccessMessage("");
      if (data.user) {
        await utils.auth.me.invalidate();
      }
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    localAccess.mutate({
      mode,
      name: mode === "signup" ? name : undefined,
      email,
    });
  };

  return (
    <main
      className="min-h-screen bg-fifa-navy bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(10, 31, 63, 0.9), rgba(10, 31, 63, 0.68)), url(${headerBackground})`,
      }}
    >
      <div className="container flex min-h-screen items-center justify-center py-10">
        <section className="grid w-full max-w-5xl gap-8 md:grid-cols-[1fr_420px] md:items-center">
          <div className="space-y-6">
            <img
              src={siteLogo}
              alt="FIFA Ticket Hub"
              className="h-20 w-auto rounded-md bg-white/90 object-contain p-2"
            />
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-fifa-gold">
                FIFA Ticket Hub
              </p>
              <h1 className=" max-w-full text-4xl font-bold leading-tight md:text-5xl">
                Sign in before browsing tickets.
              </h1>
              <p className=" max-w-full text-lg text-white/80">
                Create an account or log in with your email to access matches, packages, and ticket inquiries.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-white/15 bg-white p-6 text-fifa-navy shadow-2xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <p className="text-sm font-semibold uppercase text-fifa-light-blue">
                    Account access
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    {mode === "login" ? "Login" : "Sign up"}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-lg bg-fifa-navy/5 p-1">
                  <button
                    type="button"
                    className={`rounded-md px-4 py-2 text-sm font-semibold ${
                      mode === "login" ? "bg-fifa-navy text-white" : "text-fifa-navy"
                    }`}
                    onClick={() => {
                      setMode("login");
                      setSuccessMessage("");
                    }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`rounded-md px-4 py-2 text-sm font-semibold ${
                      mode === "signup" ? "bg-fifa-navy text-white" : "text-fifa-navy"
                    }`}
                    onClick={() => {
                      setMode("signup");
                      setSuccessMessage("");
                    }}
                  >
                    Sign up
                  </button>
                </div>

                {mode === "signup" && (
                  <label className="block space-y-2">
                    <span className="text-sm font-medium">Full name</span>
                    <input
                      className="w-full rounded-md border border-border bg-white px-3 py-2 text-fifa-navy outline-none focus:ring-2 focus:ring-fifa-gold"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </label>
                )}

                <label className="block space-y-2">
                  <span className="text-sm font-medium">Email address</span>
                  <input
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-fifa-navy outline-none focus:ring-2 focus:ring-fifa-gold"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>

                {localAccess.error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {localAccess.error.message}
                  </p>
                )}

                {successMessage && (
                  <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                    {successMessage}
                  </p>
                )}

                <Button className="w-full" disabled={localAccess.isPending}>
                  {mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {localAccess.isPending
                    ? "Please wait..."
                    : mode === "login"
                      ? "Login"
                      : "Create account"}
                </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
