import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import TicketPackageCard from '@/components/TicketPackageCard';
import { format } from 'date-fns';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { worldCup2026Matches } from './Matches';
import { TICKET_CATEGORIES } from '@shared/types';

export default function MatchDetail() {
  const params = useParams();
  const matchId = parseInt(params.id as string);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  const { data: apiMatch, isLoading: matchLoading } = trpc.matches.getById.useQuery({ id: matchId });
  const { data: packages, isLoading: packagesLoading } = trpc.packages.getByMatchId.useQuery({ matchId });
  const fallbackMatch = worldCup2026Matches.find((item) => item.id === matchId);
  const match = apiMatch ?? fallbackMatch;
  const displayedPackages = TICKET_CATEGORIES.map((category) => {
    const pkg = packages?.find((item) => item.category === category.name);
    if (pkg) return pkg;
    return {
      id: -category.id,
      category: category.name,
      price: category.price,
      currency: 'USD',
      description: null,
      benefits: null,
      seatType: null,
      quantity: 1000,
      quantitySold: 0,
    };
  });

  if (matchLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fifa-navy mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground">Match not found</p>
        </Card>
      </div>
    );
  }

  const availabilityColor = {
    available: 'bg-green-100 text-green-800',
    limited: 'bg-yellow-100 text-yellow-800',
    sold_out: 'bg-red-100 text-red-800',
  };

  const availabilityLabel = {
    available: 'Available',
    limited: 'Limited Availability',
    sold_out: 'Sold Out',
  };

  const handleWhatsAppClick = (packageId?: number) => {
    const selected = packageId ? displayedPackages.find((pkg) => pkg.id === packageId) : undefined;
    const message = selected
      ? `Hello! I'm interested in ${match.team1} vs ${match.team2} tickets (${match.stadium}) - ${selected.category} at ${selected.price} ${selected.currency}. Could you please confirm availability and pricing?`
      : `Hello! I'm interested in ${match.team1} vs ${match.team2} tickets at ${match.stadium} on ${format(new Date(match.matchDate), 'MMM dd, yyyy')}. Could you please provide availability and pricing information?`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/17023091509?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Match Header */}
      <section className="gradient-fifa text-white py-12">
        <div className="container">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-100 mb-2">Match #{match.matchNumber}</p>
              <h1 className="text-5xl font-bold mb-2">
                {match.team1} vs {match.team2}
              </h1>
              <p className="text-xl text-gray-100 capitalize">{match.stage.replace('_', ' ')}</p>
            </div>
            <Badge className={`${availabilityColor[match.availability as keyof typeof availabilityColor]} text-lg px-4 py-2`}>
              {availabilityLabel[match.availability as keyof typeof availabilityLabel]}
            </Badge>
          </div>
        </div>
      </section>

      {/* Match Information */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Date & Time</p>
              <p className="text-2xl font-bold">{format(new Date(match.matchDate), 'MMM dd, yyyy')}</p>
              <p className="text-lg text-fifa-gold">{format(new Date(match.matchDate), 'HH:mm')}</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Stadium</p>
              <p className="text-2xl font-bold">{match.stadium}</p>
              <p className="text-lg text-muted-foreground">{match.city}, {match.country}</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Team 1</p>
              <p className="text-2xl font-bold">{match.team1}</p>
              <p className="text-lg text-fifa-gold">{match.team1Code}</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Team 2</p>
              <p className="text-2xl font-bold">{match.team2}</p>
              <p className="text-lg text-fifa-gold">{match.team2Code}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Ticket Packages */}
      <section id="ticket-packages" className="section-padding scroll-mt-24">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Ticket Categories</h2>

          {packagesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-96 bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedPackages.map((pkg) => (
                <TicketPackageCard
                  key={pkg.id}
                  id={pkg.id}
                  category={pkg.category}
                  price={typeof pkg.price === 'number' ? pkg.price : parseFloat(pkg.price.toString())}
                  currency={pkg.currency}
                  description={pkg.description || undefined}
                  benefits={Array.isArray(pkg.benefits) ? pkg.benefits : pkg.benefits ? JSON.parse(pkg.benefits) : undefined}
                  seatType={pkg.seatType || undefined}
                  quantityAvailable={pkg.quantity - pkg.quantitySold}
                  onSelect={setSelectedPackageId}
                  isHighlighted={selectedPackageId === pkg.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-fifa text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Book Your Tickets?</h2>
          <p className="text-xl text-gray-100 mb-8">
            Contact us directly on WhatsApp to discuss availability, pricing, and payment options.
          </p>
          <Button
            onClick={() => handleWhatsAppClick(selectedPackageId || undefined)}
            className="bg-white text-fifa-navy hover:bg-gray-100 px-8 py-6 text-lg font-semibold inline-flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Us on WhatsApp
          </Button>
        </div>
      </section>
    </div>
  );
}
