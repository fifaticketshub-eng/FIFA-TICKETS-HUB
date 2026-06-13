import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'wouter';
import { MessageCircle } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      question: 'How do I buy tickets?',
      answer:
        'Browse our available matches on the website, select your preferred match and ticket category, then contact us via WhatsApp. Our team will provide availability, pricing, and guide you through the booking process.',
    },
    {
      question: 'How do I contact you?',
      answer:
        'The easiest way to reach us is through WhatsApp. Click the WhatsApp button on any page or contact form to start a conversation with our team. We typically respond within minutes during business hours.',
    },
    {
      question: 'Are tickets authentic?',
      answer:
        'Yes, 100% of our tickets are authentic and sourced directly from official FIFA channels. We verify every ticket before delivery and offer a full refund guarantee if any ticket is found to be inauthentic.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'We accept multiple payment methods including PayPal, Visa, Mastercard, American Express, bank transfers, cryptocurrency, and other mutually agreed methods. Payment discussions occur privately through WhatsApp.',
    },
    {
      question: 'How are tickets delivered?',
      answer:
        'Tickets are delivered via secure methods based on your preference and location. Options include digital delivery via email, physical delivery via courier, or hand delivery for local customers. We ensure safe and timely delivery worldwide.',
    },
    {
      question: 'Can I buy multiple tickets?',
      answer:
        'Absolutely! We can arrange bulk ticket purchases for groups, families, or organizations. Contact us via WhatsApp to discuss group pricing and special arrangements.',
    },
    {
      question: 'How long does delivery take?',
      answer:
        'Delivery times vary based on your location and delivery method. Digital tickets are typically delivered within 24 hours. Physical delivery usually takes 3-7 business days depending on your location. We can discuss expedited options if needed.',
    },
    {
      question: 'What if I need to change my tickets?',
      answer:
        'We offer flexible exchange options for most ticket categories. Contact us via WhatsApp to discuss your specific situation and available alternatives.',
    },
    {
      question: 'Is my payment information secure?',
      answer:
        'Yes, all transactions are secure. We use industry-standard encryption and never store payment information. Payment details are discussed privately through WhatsApp with our trusted team.',
    },
    {
      question: 'What is your refund policy?',
      answer:
        'We offer refunds for cancelled matches or if tickets are found to be inauthentic. For other situations, please contact us via WhatsApp to discuss your specific circumstances.',
    },
    {
      question: 'Can I resell my tickets?',
      answer:
        'Ticket resale policies depend on FIFA regulations and your ticket category. Contact us via WhatsApp to understand the resale options available for your specific tickets.',
    },
    {
      question: 'Do you offer group discounts?',
      answer:
        'Yes! We offer special pricing for group purchases. Contact us via WhatsApp with your group size and match preferences to receive a customized quote.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-fifa text-white py-14 sm:py-16">
        <div className="container">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">Frequently Asked Questions</h1>
            <p className="text-lg sm:text-xl leading-8 text-gray-100">
              Find answers to common questions about FIFA World Cup tickets.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container max-w-5xl">
          <Accordion type="single" collapsible className="space-y-5">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border border-border rounded-xl px-5 sm:px-8 bg-card">
                <AccordionTrigger className="hover:no-underline py-5 sm:py-6">
                  <span className="text-left font-semibold text-lg sm:text-xl leading-7 pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 text-base sm:text-lg leading-8">
                  <div className="max-w-4xl">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section-padding bg-card border-t border-border">
        <div className="container text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg text-muted-foreground leading-8 mb-8">
            Our team is here to help! Contact us directly via WhatsApp for personalized assistance.
          </p>
          <Button 
            onClick={() => {
              const message = encodeURIComponent('Hello! I have some questions about FIFA World Cup tickets.');
              window.open(`https://wa.me/237653749842?text=${message}`, '_blank');
            }}
            className="bg-fifa-navy text-white hover:opacity-90 px-8 py-6 text-lg font-semibold inline-flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Chat With Us on WhatsApp
          </Button>
        </div>
      </section>

      {/* Browse Tickets CTA */}
      <section className="section-padding gradient-fifa text-white">
        <div className="container text-center max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">Ready to Get Your Tickets?</h2>
          <p className="text-xl text-gray-100 leading-8 mb-8">
            Browse our available matches and start your FIFA World Cup journey today.
          </p>
          <Link href="/matches">
            <Button className="bg-fifa-gold text-fifa-navy hover:opacity-90 px-8 py-6 text-lg font-semibold">
              Browse All Matches
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
