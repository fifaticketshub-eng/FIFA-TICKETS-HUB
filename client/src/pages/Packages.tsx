import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import TicketPackageCard from '@/components/TicketPackageCard';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function Packages() {
  const { data: packages, isLoading } = trpc.packages.list.useQuery();
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  // Group packages by category
  const groupedPackages = packages?.reduce((acc, pkg) => {
    const category = pkg.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(pkg);
    return acc;
  }, {} as Record<string, typeof packages>) || {};

  const categoryOrder = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  const categoryAnchors: Record<string, string> = {
    'Category 1': 'category-1',
    'Category 2': 'category-2',
    'Category 3': 'category-3',
    'Category 4': 'category-4',
  };
  const categoryDetails: Record<string, { seating: string; description: string; priceHint: string }> = {
    'Category 1': {
      seating: 'Premium Lower',
      description: 'Best available views with premium seating close to the pitch.',
      priceHint: 'Premium pricing',
    },
    'Category 2': {
      seating: 'Mid-Level',
      description: 'Excellent stadium views with a strong balance of comfort and value.',
      priceHint: 'High-value pricing',
    },
    'Category 3': {
      seating: 'Upper Level',
      description: 'Good matchday views for fans who want reliable access at lower cost.',
      priceHint: 'Affordable pricing',
    },
    'Category 4': {
      seating: 'General',
      description: 'Standard seating for budget-friendly World Cup access.',
      priceHint: 'Budget pricing',
    },
  };

  const handleWhatsAppClick = (packageId: number) => {
    const pkg = packages?.find((p) => p.id === packageId);
    if (pkg) {
      const message = `Hello! I'm interested in ${pkg.category} tickets at ${pkg.price} ${pkg.currency}. Could you please provide more details and availability?`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/1234567890?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-fifa text-white py-10 sm:py-12">
        <div className="container">
          <h1 className="max-w-4xl text-3xl font-bold sm:text-4xl bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Ticket Categories</h1>
          <p className="mt-2 max-w-3xl max-w-full text-base text-gray-100 sm:text-lg">Compare our premium ticket tiers and find the perfect option for you</p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="section-padding">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-96 bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Category-based display */}
              <div className="flex flex-wrap gap-6">
                {categoryOrder.map((category) => {
                  const categoryPackages = groupedPackages[category] || [];
                  const details = categoryDetails[category];

                  return (
                    <Card
                      key={category}
                      id={categoryAnchors[category]}
                      className="scroll-mt-24 flex min-h-[360px] flex-1 basis-full flex-col p-6 md:basis-[calc(50%-0.75rem)] xl:basis-[calc(25%-1.125rem)]"
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">{category}</h2>
                        <p className="text-muted-foreground">{details.description}</p>
                      </div>
                      <div className="flex flex-1 flex-col gap-4">
                        {categoryPackages.length > 0 ? (
                          categoryPackages.map((pkg) => (
                            <TicketPackageCard
                              key={pkg.id}
                              id={pkg.id}
                              category={pkg.category}
                              price={parseFloat(pkg.price.toString())}
                              currency={pkg.currency}
                              description={pkg.description || undefined}
                              benefits={pkg.benefits ? JSON.parse(pkg.benefits) : undefined}
                              seatType={pkg.seatType || undefined}
                              quantityAvailable={pkg.quantity - pkg.quantitySold}
                              onSelect={setSelectedPackageId}
                              isHighlighted={selectedPackageId === pkg.id}
                            />
                          ))
                        ) : (
                          <div className="flex flex-1 flex-col">
                            <h3 className="text-xl font-semibold mb-2">{details.seating}</h3>
                            <p className="text-muted-foreground mb-4">{details.description}</p>
                            <p className="font-semibold text-fifa-navy mb-6">{details.priceHint}</p>
                            <Button
                              onClick={() => {
                                const message = `Hello! I'm interested in ${category} FIFA World Cup tickets. Could you please provide availability and pricing information?`;
                                window.open(`https://wa.me/1234567890?text=${encodeURIComponent(message)}`, '_blank');
                              }}
                              className="mt-auto w-full bg-fifa-navy text-white hover:opacity-90"
                            >
                              Ask About {category}
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Comparison Table */}
              <div className="mt-16 overflow-x-auto">
                <h2 className="text-2xl font-bold mb-6 sm:text-3xl sm:mb-8">Feature Comparison</h2>
                <table className="w-full min-w-[720px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-fifa-navy">
                      <th className="text-left py-4 px-4 font-bold">Feature</th>
                      {categoryOrder.map((category) => (
                        <th key={category} className="text-center py-4 px-4 font-bold">
                          {category}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-4 px-4 font-semibold">Seating Location</td>
                      <td className="text-center py-4 px-4">Premium Lower</td>
                      <td className="text-center py-4 px-4">Mid-Level</td>
                      <td className="text-center py-4 px-4">Upper Level</td>
                      <td className="text-center py-4 px-4">General</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-4 font-semibold">View Quality</td>
                      <td className="text-center py-4 px-4">⭐⭐⭐⭐⭐</td>
                      <td className="text-center py-4 px-4">⭐⭐⭐⭐</td>
                      <td className="text-center py-4 px-4">⭐⭐⭐</td>
                      <td className="text-center py-4 px-4">⭐⭐</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-4 font-semibold">VIP Lounge Access</td>
                      <td className="text-center py-4 px-4">✓</td>
                      <td className="text-center py-4 px-4">✓</td>
                      <td className="text-center py-4 px-4">-</td>
                      <td className="text-center py-4 px-4">-</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-4 font-semibold">Complimentary Drinks</td>
                      <td className="text-center py-4 px-4">✓</td>
                      <td className="text-center py-4 px-4">-</td>
                      <td className="text-center py-4 px-4">-</td>
                      <td className="text-center py-4 px-4">-</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-4 font-semibold">Premium Parking</td>
                      <td className="text-center py-4 px-4">✓</td>
                      <td className="text-center py-4 px-4">✓</td>
                      <td className="text-center py-4 px-4">-</td>
                      <td className="text-center py-4 px-4">-</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold">Flexible Exchange</td>
                      <td className="text-center py-4 px-4">✓</td>
                      <td className="text-center py-4 px-4">✓</td>
                      <td className="text-center py-4 px-4">✓</td>
                      <td className="text-center py-4 px-4">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-fifa text-white">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-6 sm:text-4xl bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Find Your Perfect Ticket</h2>
          <p className="mx-auto max-w-3xl max-w-full text-lg text-gray-100 mb-8 sm:text-xl">
            Contact our team to discuss which category suits your needs best and get special pricing.
          </p>
          <Button
            onClick={() => handleWhatsAppClick(selectedPackageId || packages?.[0]?.id || 0)}
            className="w-full bg-white text-fifa-navy hover:bg-gray-100 px-6 py-6 text-base font-semibold inline-flex items-center gap-2 sm:w-auto sm:px-8 sm:text-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Chat With Us on WhatsApp
          </Button>
        </div>
      </section>
    </div>
  );
}
