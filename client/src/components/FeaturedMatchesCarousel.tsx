import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MatchCard from './MatchCard';

interface Match {
  id: number;
  matchNumber: number;
  team1: string;
  team1Code: string;
  team2: string;
  team2Code: string;
  stadium: string;
  city: string;
  matchDate: Date | string;
  stage: string;
  availability: 'available' | 'limited' | 'sold_out';
  imageUrl?: string | null;
}

interface FeaturedMatchesCarouselProps {
  matches: Match[];
  isLoading?: boolean;
}

export default function FeaturedMatchesCarousel({ matches, isLoading }: FeaturedMatchesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Update items per slide based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(matches.length / itemsPerSlide);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const startIndex = currentIndex * itemsPerSlide;
  const visibleMatches = matches.slice(startIndex, startIndex + itemsPerSlide);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Carousel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleMatches.map((match) => (
          <MatchCard
            key={match.id}
            id={match.id}
            matchNumber={match.matchNumber}
            team1={match.team1}
            team1Code={match.team1Code}
            team2={match.team2}
            team2Code={match.team2Code}
            stadium={match.stadium}
            city={match.city}
            matchDate={new Date(match.matchDate)}
            stage={match.stage}
            availability={match.availability}
            imageUrl={match.imageUrl || undefined}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-between mt-8">
          <Button
            onClick={goToPrevious}
            size="icon"
            className="rounded-full w-12 h-12 bg-fifa-navy text-white hover:opacity-90 shadow-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-fifa-gold w-8' : 'bg-muted-foreground'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <Button
            onClick={goToNext}
            size="icon"
            className="rounded-full w-12 h-12 bg-fifa-navy text-white hover:opacity-90 shadow-md"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Slide Counter */}
      {totalSlides > 1 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          {currentIndex + 1} / {totalSlides}
        </p>
      )}
    </div>
  );
}
