import { FormEvent, useState } from 'react';
import { CheckCircle2, Mail, ShieldCheck, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isEmailJsConfigured, sendTicketVerificationEmail } from '@/lib/emailjs';
import { toast } from 'sonner';

export default function VerifyTicket() {
  const [ticketCode, setTicketCode] = useState('');
  const [email, setEmail] = useState('');
  const [confirmation, setConfirmation] = useState<{
    ticketCode: string;
    email: string;
    verificationReference: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const normalizedTicketCode = ticketCode.trim().toUpperCase();
    const normalizedEmail = email.trim();
    const verificationReference = `VERIFY-${Date.now().toString(36).toUpperCase()}`;

    if (!isEmailJsConfigured()) {
      toast.error('EmailJS is not configured. Add your service ID, template ID, and public key.');
      return;
    }

    setIsSubmitting(true);

    try {
      await sendTicketVerificationEmail({
        toEmail: normalizedEmail,
        ticketCode: normalizedTicketCode,
        verificationReference,
      });

      setConfirmation({
        ticketCode: normalizedTicketCode,
        email: normalizedEmail,
        verificationReference,
      });
      setTicketCode('');
      setEmail('');
      toast.success('Ticket confirmation email sent.');
    } catch (err: any) {
      console.error('EmailJS error:', err);
      const detail = err?.text || err?.message || String(err);
      toast.error(`EmailJS error: ${detail}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="gradient-fifa py-14 text-white sm:py-16">
        <div className="container">
          <div className="max-w-5xl max-w-full">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-fifa-gold" />
              Secure ticket check
            </div>

            <h1
              className="mb-4 text-4xl font-bold leading-tight sm:text-5xl bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent"
              style={{
                filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.35))",
              }}
            >
              Verify Your Ticket
            </h1>

            <p className="text-lg leading-8 text-gray-100 sm:text-xl">
              Enter your ticket code and email address. We will confirm the request
              and send ticket verification details to the email provided.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <Card className="p-6 shadow-lg sm:p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="mb-3 text-3xl font-bold">Ticket details</h2>
                <p className="text-muted-foreground">
                  Use the exact code printed on your ticket or confirmation receipt.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold" htmlFor="ticketCode">
                    Ticket Code *
                  </label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="ticketCode"
                      value={ticketCode}
                      onChange={(event) => setTicketCode(event.target.value)}
                      placeholder="e.g. FIFA-2026-AB1234"
                      className="pl-10 uppercase"
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold" htmlFor="ticketEmail">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="ticketEmail"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="your@email.com"
                      className="pl-10"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-fifa-navy py-6 text-lg font-semibold text-white hover:bg-fifa-gold hover:text-fifa-navy"
                >
                  {isSubmitting ? 'Sending...' : 'Verify Ticket'}
                </Button>
              </form>
            </Card>

            <div className="space-y-6">
              {confirmation ? (
                <Card className="border-green-200 bg-green-50 p-6 text-green-950 shadow-md sm:p-8">
                  <CheckCircle2 className="mb-4 h-12 w-12 text-green-600" />
                  <h3 className="mb-3 text-2xl font-bold">Verification request received</h3>
                  <p className="mb-5 leading-7">
                    Confirmation details for ticket {confirmation.ticketCode} were sent to {confirmation.email}.
                  </p>
                  <div className="rounded-lg border border-green-200 bg-white p-4">
                    <p className="text-sm font-semibold text-green-800">Reference</p>
                    <p className="mt-1 font-mono text-lg font-bold text-green-950">
                      {confirmation.verificationReference}
                    </p>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 shadow-md sm:p-8">
                  <ShieldCheck className="mb-4 h-12 w-12 text-fifa-gold" />
                  <h3 className="mb-3 text-2xl font-bold">What happens next?</h3>
                  <p className="leading-7 text-muted-foreground">
                    The verification message is sent through EmailJS to the address entered here.
                  </p>
                </Card>
              )}

              <Card className="gradient-fifa p-6 text-white shadow-md sm:p-8">
                <h3 className="mb-3 text-2xl font-bold">Need help?</h3>
                <p className="leading-7 text-gray-100">
                  If your code is unreadable or your email has changed, contact support with your purchase receipt.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
