import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { MessageCircle, Mail, Phone } from 'lucide-react';
import { Link } from 'wouter';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    matchId: 'all',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: matches } = trpc.matches.list.useQuery();
  const createInquiry = trpc.inquiries.create.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, matchId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createInquiry.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        matchId: formData.matchId !== 'all' ? parseInt(formData.matchId) : undefined,
        message: formData.message,
      });

      toast.success('Inquiry submitted successfully! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        matchId: 'all',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-fifa text-white py-14 sm:py-16">
        <div className="container">
          <div className="max-w-5xl max-w-full">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">Contact Us</h1>
            <p className="text-lg sm:text-xl leading-8 text-gray-100">
              Get in touch with our team for ticket inquiries and support.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 sm:p-10 text-center hover:shadow-lg transition-shadow">
              <MessageCircle className="w-12 h-12 text-fifa-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
              <p className="text-muted-foreground leading-7 mb-6">
                Fastest way to reach us. We typically respond within minutes.
              </p>
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={() => {
                  const message = encodeURIComponent('Hello! I\'m interested in FIFA World Cup tickets.');
                  window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
                }}
              >
                Chat on WhatsApp
              </Button>
            </Card>

            <Card className="p-8 sm:p-10 text-center hover:shadow-lg transition-shadow">
              <Mail className="w-12 h-12 text-fifa-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-muted-foreground leading-7 mb-6">
                Send us an email and we'll respond within 24 hours.
              </p>
              <a href="mailto:tickets@fifatickets.com" className="font-semibold text-fifa-navy hover:underline dark:text-fifa-gold">
                tickets@fifatickets.com
              </a>
            </Card>

            <Card className="p-8 sm:p-10 text-center hover:shadow-lg transition-shadow">
              <Phone className="w-12 h-12 text-fifa-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Phone</h3>
              <p className="text-muted-foreground leading-7 mb-6">
                Call us during business hours for immediate assistance.
              </p>
              <a href="tel:+1234567890" className="font-semibold text-fifa-navy hover:underline dark:text-fifa-gold">
                +1 (234) 567-890
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-card">
        <div className="container max-w-4xl max-w-full">
          <div className="mb-8 max-w-5xl max-w-full ">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">Send Us a Message</h2>
            <p className="text-muted-foreground leading-7">
              Share the match, category, and number of tickets you need. We will respond with availability and next steps.
            </p>
          </div>
          <Card className="p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (234) 567-890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Interested Match (Optional)</label>
                <Select value={formData.matchId} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a match" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Matches</SelectItem>
                    {matches?.map((match) => (
                      <SelectItem key={match.id} value={match.id.toString()}>
                        {match.team1} vs {match.team2} - {match.stadium}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Message *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your ticket needs..."
                  rows={6}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-lg font-semibold"
              >
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Business Hours */}
      <section className="section-padding border-t border-border bg-white text-fifa-navy dark:bg-fifa-navy dark:text-white">
        <div className="container max-w-4xl">
          <Card className="p-8 sm:p-10 bg-fifa-navy text-white dark:bg-white dark:text-fifa-navy">
            <h3 className="text-2xl font-bold mb-6 text-white dark:text-fifa-navy">Business Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-2 text-white dark:text-fifa-navy">Monday - Friday</p>
                <p className="text-white/90 leading-7 dark:text-fifa-navy/80">9:00 AM - 6:00 PM (GMT)</p>
              </div>
              <div>
                <p className="font-semibold mb-2 text-white dark:text-fifa-navy">Saturday - Sunday</p>
                <p className="text-white/90 leading-7 dark:text-fifa-navy/80">10:00 AM - 4:00 PM (GMT)</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-7 mt-6 dark:text-fifa-navy/70">
              WhatsApp support is available 24/7 for urgent inquiries.
            </p>
          </Card>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section-padding bg-white border-t border-border text-fifa-navy dark:bg-fifa-navy dark:text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-8 text-fifa-navy dark:text-white">Quick Links</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/matches">
              <Button variant="outline" className="w-full sm:w-auto border-fifa-navy text-fifa-navy hover:bg-fifa-navy hover:text-white">
                Browse Matches
              </Button>
            </Link>
            <Link href="/packages">
              <Button variant="outline" className="w-full sm:w-auto border-fifa-navy text-fifa-navy hover:bg-fifa-navy hover:text-white">
                View Packages
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" className="w-full sm:w-auto border-fifa-navy text-fifa-navy hover:bg-fifa-navy hover:text-white">
                Read FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
