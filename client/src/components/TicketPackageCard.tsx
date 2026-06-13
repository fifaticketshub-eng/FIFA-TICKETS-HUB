import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface TicketPackageCardProps {
  id: number;
  category: string;
  price: number;
  currency: string;
  description?: string;
  benefits?: string[];
  seatType?: string;
  quantityAvailable: number;
  onSelect: (packageId: number) => void;
  isHighlighted?: boolean;
}

export default function TicketPackageCard({
  id,
  category,
  price,
  currency,
  description,
  benefits,
  seatType,
  quantityAvailable,
  onSelect,
  isHighlighted = false,
}: TicketPackageCardProps) {
  const benefitsList = benefits ? (typeof benefits === 'string' ? JSON.parse(benefits) : benefits) : [];

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 flex flex-col h-full ${
        isHighlighted
          ? 'ring-2 ring-fifa-gold shadow-xl scale-105'
          : 'hover:shadow-lg'
      }`}
    >
      {/* Header */}
      <div className={`p-6 ${isHighlighted ? 'bg-gradient-fifa text-white' : 'bg-card'}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold">{category}</h3>
          {isHighlighted && (
            <Badge className="bg-fifa-gold text-fifa-navy">Popular</Badge>
          )}
        </div>
        {seatType && (
          <p className={`text-sm ${isHighlighted ? 'text-gray-100' : 'text-muted-foreground'}`}>
            {seatType}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-fifa-gold">{price}</span>
          <span className={`text-lg ${isHighlighted ? 'text-gray-100' : 'text-muted-foreground'}`}>
            {currency}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">per ticket</p>
      </div>

      {/* Description */}
      {description && (
        <div className="px-6 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}

      {/* Benefits */}
      {benefitsList.length > 0 && (
        <div className="px-6 py-4 flex-1">
          <p className="text-sm font-semibold mb-3">Includes:</p>
          <ul className="space-y-2">
            {benefitsList.map((benefit: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-fifa-gold mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Availability */}
      <div className="px-6 py-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {quantityAvailable > 0 ? (
            <span className="text-green-600 font-semibold">{quantityAvailable} tickets available</span>
          ) : (
            <span className="text-red-600 font-semibold">Sold Out</span>
          )}
        </p>
      </div>

      {/* CTA */}
      <div className="p-6 border-t border-border">
        <Button
          onClick={() => onSelect(id)}
          disabled={quantityAvailable === 0}
          className={`w-full ${
            isHighlighted
              ? 'bg-fifa-gold text-fifa-navy hover:opacity-90'
              : 'bg-fifa-navy text-white hover:opacity-90'
          }`}
        >
          {quantityAvailable > 0 ? 'Contact for Booking' : 'Sold Out'}
        </Button>
      </div>
    </Card>
  );
}
