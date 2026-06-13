import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Award, Users, Globe, CheckCircle, Zap, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-fifa text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2">About  
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent"> 
              FIFA Ticket Hub  </span></h1>
          <p className="text-lg text-gray-100">Your trusted partner for authentic FIFA World Cup tickets</p>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Who We Are</h2>
              <p className="text-lg text-muted-foreground mb-4">
                FIFA Ticket Hub is a leading provider of authentic FIFA World Cup tickets, dedicated to connecting passionate football fans with the world's greatest tournament. With years of experience in the ticketing industry, we've established ourselves as a trusted name for premium match access.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Our mission is simple: to make FIFA World Cup tickets accessible to fans worldwide, with transparent pricing, authentic guarantees, and exceptional customer service.
              </p>
              <p className="text-lg text-muted-foreground">
                Whether you're a casual fan or a dedicated supporter, we have the perfect ticket option for you.
              </p>
            </div>
            <Card className="p-8 bg-fifa-navy bg-gradient-fifa text-white border-none">
              <h3 className="text-2xl font-bold mb-6 text-white">Our Commitment</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>100% authentic tickets from official sources</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Transparent pricing with no hidden fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Fast, reliable customer support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Secure transactions and buyer protection</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Worldwide delivery and support</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience & Expertise */}
      <section className="section-padding bg-card border-b border-border">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Award className="w-12 h-12 text-fifa-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">15+ Years</h3>
              <p className="text-muted-foreground">
                Experience in the global ticketing industry
              </p>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-fifa-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">50,000+</h3>
              <p className="text-muted-foreground">
                Satisfied customers worldwide
              </p>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Globe className="w-12 h-12 text-fifa-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">120+</h3>
              <p className="text-muted-foreground">
                Countries served with premium service
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Why You Can Trust Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <Shield className="w-8 h-8 text-fifa-gold mb-4" />
              <h3 className="text-xl font-bold mb-3">Authentic Tickets</h3>
              <p className="text-muted-foreground">
                All tickets are verified and sourced directly from official FIFA channels. We guarantee 100% authenticity or your money back.
              </p>
            </Card>
            <Card className="p-8">
              <Zap className="w-8 h-8 text-fifa-gold mb-4" />
              <h3 className="text-xl font-bold mb-3">Fast Response</h3>
              <p className="text-muted-foreground">
                Our dedicated team responds to inquiries within minutes through WhatsApp, ensuring you never miss out on tickets.
              </p>
            </Card>
            <Card className="p-8">
              <CheckCircle className="w-8 h-8 text-fifa-gold mb-4" />
              <h3 className="text-xl font-bold mb-3">Verified Reviews</h3>
              <p className="text-muted-foreground">
                Thousands of verified customer reviews and testimonials showcase our commitment to excellence and customer satisfaction.
              </p>
            </Card>
            <Card className="p-8">
              <Award className="w-8 h-8 text-fifa-gold mb-4" />
              <h3 className="text-xl font-bold mb-3">Industry Recognition</h3>
              <p className="text-muted-foreground">
                Recognized by FIFA and major ticketing organizations for our integrity, service quality, and customer care standards.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="section-padding bg-card border-b border-border">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: 'Browse & Select',
                  description: 'Explore our comprehensive match listings and select your preferred matches and ticket categories.',
                },
                {
                  step: 2,
                  title: 'Contact Us',
                  description: 'Reach out via WhatsApp to discuss availability, pricing, and special offers tailored to your needs.',
                },
                {
                  step: 3,
                  title: 'Confirm & Pay',
                  description: 'Confirm your selection and choose your preferred payment method. We accept multiple secure payment options.',
                },
                {
                  step: 4,
                  title: 'Receive Tickets',
                  description: 'Receive your authentic tickets via secure delivery. We ensure safe and timely delivery worldwide.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-fifa-navy text-white font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Success Stories */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Customer Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'John Smith',
                location: 'USA',
                quote: 'FIFA Ticket Hub made it incredibly easy to get tickets for the final match. The process was smooth and the tickets arrived on time!',
              },
              {
                name: 'Maria Garcia',
                location: 'Spain',
                quote: 'Excellent service! The team responded quickly to my inquiries and helped me find the perfect seats for my family.',
              },
              {
                name: 'Ahmed Hassan',
                location: 'UAE',
                quote: 'Professional, reliable, and trustworthy. I\'ve purchased multiple times and never had any issues. Highly recommended!',
              },
            ].map((story, idx) => (
              <Card key={idx} className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-fifa-gold">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{story.quote}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-bold">{story.name}</p>
                  <p className="text-sm text-muted-foreground">{story.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-fifa text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Thousands of Happy Fans?</h2>
          <p className="text-xl text-gray-100 mb-8">
            Secure your FIFA World Cup tickets today and be part of the greatest sporting event on Earth.
          </p>
          <Link href="/matches">
            <Button className="bg-fifa-gold text-fifa-navy hover:opacity-90 px-8 py-6 text-lg font-semibold">
              Browse Tickets Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
