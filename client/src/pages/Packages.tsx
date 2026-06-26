import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TicketPackageCard from '@/components/TicketPackageCard';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { TICKET_CATEGORIES } from '@shared/types';

export default function Packages() {
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

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
    const pkg = TICKET_CATEGORIES.find((item) => item.id === packageId);
    if (!pkg) return;
    const message = `Hello! I'm interested in ${pkg.name} tickets at ${pkg.price} USD. Could you please provide more details and availability?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/17023091509?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
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
          <div className="flex flex-wrap gap-6">
            {categoryOrder.map((categoryName) => {
              const category = TICKET_CATEGORIES.find((item) => item.name === categoryName);
              const details = categoryDetails[categoryName];
              if (!category) return null;

              return (
                <Card
                  key={category.name}
                  id={categoryAnchors[category.name]}
                  className="scroll-mt-24 flex min-h-[360px] flex-1 basis-full flex-col p-6 md:basis-[calc(50%-0.75rem)] xl:basis-[calc(25%-1.125rem)]"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                    <p className="text-muted-foreground">{details.description}</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <TicketPackageCard
                      id={category.id}
                      category={category.name}
                      price={category.price}
                      currency="USD"
                      description={details.seating}
                      quantityAvailable={9999}
                      onSelect={setSelectedPackageId}
                      isHighlighted={selectedPackageId === category.id}
                    />
                  </div>
                </Card>
              );
            })}
          </div>

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
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-fifa text-white">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-6 sm:text-4xl bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Find Your Perfect Ticket</h2>
          <p className="mx-auto max-w-3xl max-w-full text-lg text-gray-100 mb-8 sm:text-xl">
            Contact our team to discuss which category suits your needs best and confirm match-specific pricing.
          </p>
          <Button
            onClick={() => handleWhatsAppClick(selectedPackageId || TICKET_CATEGORIES[0]?.id || 0)}
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
