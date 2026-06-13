import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Link } from 'wouter';

interface MatchCardProps {
  id: number;
  matchNumber: number;
  team1: string;
  team1Code: string;
  team2: string;
  team2Code: string;
  stadium: string;
  city: string;
  matchDate: Date;
  stage: string;
  availability: 'available' | 'limited' | 'sold_out';
  imageUrl?: string;
}

export default function MatchCard({
  id,
  matchNumber,
  team1,
  team1Code,
  team2,
  team2Code,
  stadium,
  city,
  matchDate,
  stage,
  availability,
  imageUrl,
}: MatchCardProps) {
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

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {/* Match image */}
      {imageUrl && (
        <div className="w-full h-48 bg-gradient-fifa overflow-hidden">
          <img
            src={imageUrl}
            alt={`${team1} vs ${team2}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        {/* Header with match number and stage */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Match #{matchNumber}</p>
            <p className="text-xs text-muted-foreground capitalize">{stage.replace('_', ' ')}</p>
          </div>
          <Badge variant="outline" className={availabilityColor[availability]}>
            {availabilityLabel[availability]}
          </Badge>
        </div>

        {/* Teams */}
        <div className="mb-4 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <p className="font-semibold text-lg">{team1}</p>
              <p className="text-xs text-muted-foreground">{team1Code}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-fifa-gold">VS</p>
            </div>
            <div className="flex-1 text-center">
              <p className="font-semibold text-lg">{team2}</p>
              <p className="text-xs text-muted-foreground">{team2Code}</p>
            </div>
          </div>
        </div>

        {/* Date and venue */}
        <div className="mb-4 text-sm">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {format(new Date(matchDate), 'MMM dd, yyyy')}
            </span>
            {' at '}
            <span className="font-semibold text-foreground">
              {format(new Date(matchDate), 'HH:mm')}
            </span>
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{stadium}</span>, {city}
          </p>
        </div>

        {/* CTA Button */}
        <Link href={`/matches/${id}`}>
          <Button className="w-full bg-fifa-navy hover:opacity-90 text-white">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
