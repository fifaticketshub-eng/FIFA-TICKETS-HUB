  import { Button } from '@/components/ui/button';
  import { Card } from '@/components/ui/card';
  import { trpc } from '@/lib/trpc';
  import { Link } from 'wouter';
  import { ChevronRight, Shield, Zap, Globe, Users } from 'lucide-react';
  import FeaturedMatchesCarousel from '@/components/FeaturedMatchesCarousel';
  import { useState, useEffect } from 'react';
  import fifaBackground from '@/assets/fifa.jpg';
  import fifa2026Image from '@/assets/fifa2026.jpg';

  export default function Home() {
    const { data: matches, isLoading } = trpc.matches.list.useQuery();
    const [featuredMatches, setFeaturedMatches] = useState<typeof matches>([]);

    useEffect(() => {
      if (matches) {
        // Get first 3 matches for featured carousel
        setFeaturedMatches(matches.slice(0, 3));
      }
    }, [matches]);

    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section
          className="relative overflow-hidden bg-fifa-navy bg-cover bg-center bg-no-repeat text-white py-14 sm:py-20 lg:py-24"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(10, 31, 63, 0.88) 0%, rgba(10, 31, 63, 0.68) 48%, rgba(10, 31, 63, 0.45) 100%), url(${fifaBackground})`,
          }}
        >
          <div className="container relative z-10">
            <div className="grid min-h-[520px] grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
              <div className="flex w-full flex-col items-start justify-center gap-6 text-left">
                <h1 className="w-full gap -y-15 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight whitespace-normal drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)]">
                  Get Your FIFA World Cup Tickets at the Best Prices
                </h1>
                <p className="w-full text-lg sm:text-xl leading-8 text-gray-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
                  Secure your seats for the world's biggest football tournament. Contact us directly for affordable ticket offers and exclusive access to premium matches.
                </p>

                <div className="flex w-full flex-col sm:flex-row gap-4 pt-2">
                  <Link href="/matches">
                    <Button className="w-full sm:w-auto bg-fifa-gold text-fifa-navy hover:bg-yellow-400 hover:text-fifa-navy px-8 py-6 text-lg font-semibold shadow-lg">
                      Browse Tickets
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      const message = encodeURIComponent('Hello! I\'m interested in FIFA World Cup tickets.');
                      window.open(`https://wa.me/17023091509?text=${message}`, '_blank');
                    }}
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-white bg-white/10 text-white hover:bg-white hover:text-fifa-navy hover:border-white px-8 py-6 text-lg font-semibold shadow-lg"
                  >
                    Contact on WhatsApp
                  </Button>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <img
                  src={fifa2026Image}
                  alt="FIFA ticket promotion"
                  className="w-full max-w-[460px] rounded-xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Matches Carousel */}
        <section className="section-padding bg-background">
          <div className="container">
            <div className="mb-12">
              <h2 className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Featured Matches</h2>
              <p className="text-lg text-muted-foreground">
                Explore the most anticipated matches of the tournament
              </p>
            </div>

            <FeaturedMatchesCarousel
              matches={featuredMatches || []}
              isLoading={isLoading}
            />

            {featuredMatches && featuredMatches.length > 0 && (
              <div className="mt-12 text-center">
                <Link href="/matches">
                  <Button className="bg-fifa-navy text-white hover:opacity-90 px-8 py-6 text-lg shadow-md">
                    View All Matches
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="section-padding bg-card">
          <div className="container">
            <div className="mb-12">
              <h2 className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Why Choose Us</h2>
              <p className="text-lg text-muted-foreground">
                Experience the premium FIFA World Cup ticketing service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Authentic Tickets',
                  description: 'All tickets are 100% authentic and verified directly from official sources.',
                },
                {
                  icon: Zap,
                  title: 'Fast Response',
                  description: 'Get instant replies to your inquiries through WhatsApp within minutes.',
                },
                {
                  icon: Globe,
                  title: 'Worldwide Service',
                  description: 'We deliver tickets to fans across the globe with secure shipping options.',
                },
                {
                  icon: Users,
                  title: 'Personalized Support',
                  description: 'Our dedicated team helps you find the perfect tickets for your needs.',
                },
                {
                  icon: Shield,
                  title: 'Secure Transactions',
                  description: 'Safe payment methods and buyer protection for peace of mind.',
                },
                {
                  icon: Zap,
                  title: 'Competitive Prices',
                  description: 'Get the best deals on FIFA World Cup tickets in the market.',
                },
              ].map((item, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <item.icon className="w-12 h-12 text-fifa-gold mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Ticket Categories Section */}
        <section className="section-padding bg-background">
          <div className="container">
            <div className="mb-12">
              <h2 className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Ticket Categories</h2>
              <p className="text-lg text-muted-foreground">
                Choose from our premium ticket tiers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Category 1', color: 'from-fifa-gold to-yellow-500', desc: 'Premium seating', href: '/packages#category-1' },
                { name: 'Category 2', color: 'from-blue-400 to-blue-600', desc: 'Excellent view', href: '/packages#category-2' },
                { name: 'Category 3', color: 'from-purple-400 to-purple-600', desc: 'Good seating', href: '/packages#category-3' },
                { name: 'Category 4', color: 'from-green-400 to-green-600', desc: 'Standard seating', href: '/packages#category-4' },
              ].map((cat, idx) => (
                <Link key={idx} href={cat.href}>
                  <a className="block no-underline">
                    <Card
                      className={`p-8 text-center text-white bg-gradient-to-br ${cat.color} hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
                    >
                      <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                      <p className="text-sm opacity-90">{cat.desc}</p>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding gradient-fifa text-white">
          <div className="container">
            <div className="flex w-full max-w-4xl flex-col items-start justify-center gap-6 text-left">
              <h2 className="w-full text-2xl lg:text-4xl font-bold leading-tight whitespace-normal drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)]">
                Ready to Secure Your Seats?
              </h2>
              <p className="w-full text-lg sm:text-xl leading-8 text-gray-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
                Don't miss out on the world's greatest football tournament. Contact us today to reserve your tickets.
              </p>
              <Button 
                onClick={() => {
                  const message = encodeURIComponent('Hello! I\'m ready to secure my FIFA World Cup tickets. Can you help me?');
                  window.open(`https://wa.me/17023091509?text=${message}`, '_blank');
                }}
                className="w-full sm:w-auto bg-fifa-gold text-fifa-navy hover:bg-yellow-400 hover:text-fifa-navy px-8 py-6 text-lg font-semibold shadow-lg"
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }
