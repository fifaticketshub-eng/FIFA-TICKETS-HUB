import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';

export type Availability = 'available' | 'limited' | 'sold_out';

export type DisplayMatch = {
  id: number;
  matchNumber: number;
  team1: string;
  team1Code: string;
  team2: string;
  team2Code: string;
  stadium: string;
  city: string;
  country: string;
  matchDate: Date;
  stage: 'group' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final';
  group: string;
  availability: Availability;
};

export const worldCup2026Matches: DisplayMatch[] = [
  {
    id: 1,
    matchNumber: 1,
    team1: 'Mexico',
    team1Code: 'MEX',
    team2: 'South Africa',
    team2Code: 'RSA',
    stadium: 'Mexico City Stadium',
    city: 'Mexico City',
    country: 'Mexico',
    matchDate: new Date('2026-06-11T13:00:00'),
    stage: 'group',
    group: 'A',
    availability: 'available',
  },
  {
    id: 2,
    matchNumber: 2,
    team1: 'Korea Republic',
    team1Code: 'KOR',
    team2: 'Czechia',
    team2Code: 'CZE',
    stadium: 'Estadio Guadalajara',
    city: 'Guadalajara',
    country: 'Mexico',
    matchDate: new Date('2026-06-11T20:00:00'),
    stage: 'group',
    group: 'A',
    availability: 'limited',
  },
  {
    id: 3,
    matchNumber: 3,
    team1: 'Canada',
    team1Code: 'CAN',
    team2: 'Bosnia and Herzegovina',
    team2Code: 'BIH',
    stadium: 'Toronto Stadium',
    city: 'Toronto',
    country: 'Canada',
    matchDate: new Date('2026-06-12T15:00:00'),
    stage: 'group',
    group: 'B',
    availability: 'available',
  },
  {
    id: 4,
    matchNumber: 4,
    team1: 'United States',
    team1Code: 'USA',
    team2: 'Paraguay',
    team2Code: 'PAR',
    stadium: 'Los Angeles Stadium',
    city: 'Los Angeles',
    country: 'United States',
    matchDate: new Date('2026-06-12T18:00:00'),
    stage: 'group',
    group: 'D',
    availability: 'limited',
  },
  {
    id: 5,
    matchNumber: 5,
    team1: 'Haiti',
    team1Code: 'HAI',
    team2: 'Scotland',
    team2Code: 'SCO',
    stadium: 'Boston Stadium',
    city: 'Boston',
    country: 'United States',
    matchDate: new Date('2026-06-13T12:00:00'),
    stage: 'group',
    group: 'C',
    availability: 'available',
  },
  {
    id: 6,
    matchNumber: 6,
    team1: 'Australia',
    team1Code: 'AUS',
    team2: 'Turkiye',
    team2Code: 'TUR',
    stadium: 'BC Place Vancouver',
    city: 'Vancouver',
    country: 'Canada',
    matchDate: new Date('2026-06-13T15:00:00'),
    stage: 'group',
    group: 'D',
    availability: 'available',
  },
  {
    id: 7,
    matchNumber: 7,
    team1: 'Brazil',
    team1Code: 'BRA',
    team2: 'Morocco',
    team2Code: 'MAR',
    stadium: 'New York New Jersey Stadium',
    city: 'New York New Jersey',
    country: 'United States',
    matchDate: new Date('2026-06-13T18:00:00'),
    stage: 'group',
    group: 'C',
    availability: 'sold_out',
  },
  {
    id: 8,
    matchNumber: 8,
    team1: 'Qatar',
    team1Code: 'QAT',
    team2: 'Switzerland',
    team2Code: 'SUI',
    stadium: 'San Francisco Bay Area Stadium',
    city: 'San Francisco Bay Area',
    country: 'United States',
    matchDate: new Date('2026-06-13T20:00:00'),
    stage: 'group',
    group: 'B',
    availability: 'available',
  },
];

const stages = [
  { value: 'group', label: 'Group' },
  { value: 'round_of_16', label: 'Round of 16' },
  { value: 'quarter_final', label: 'Quarter Final' },
  { value: 'semi_final', label: 'Semi Final' },
  { value: 'final', label: 'Final' },
];

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

const availabilityClass: Record<Availability, string> = {
  available: 'bg-green-100 text-green-800',
  limited: 'bg-amber-100 text-amber-800',
  sold_out: 'bg-red-100 text-red-800',
};

const availabilityLabel: Record<Availability, string> = {
  available: 'Available',
  limited: 'Limited Availability',
  sold_out: 'Sold Out',
};

function stageLabel(stage: DisplayMatch['stage']) {
  return stages.find((item) => item.value === stage)?.label ?? stage;
}

export default function Matches() {
  const { data: apiMatches, isLoading: matchesLoading } = trpc.matches.list.useQuery();
  const [stageFilter, setStageFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allMatches = useMemo(() => {
    if (apiMatches && apiMatches.length > 0) {
      return apiMatches.map((match: any) => ({
        id: match.id,
        matchNumber: match.matchNumber,
        team1: match.team1,
        team1Code: match.team1Code,
        team2: match.team2,
        team2Code: match.team2Code,
        stadium: match.stadium,
        city: match.city,
        country: match.country,
        matchDate: new Date(match.matchDate),
        stage: match.stage,
        group: match.group || 'A',
        availability: match.availability || 'available',
      }));
    }
    return worldCup2026Matches;
  }, [apiMatches]);

  const filteredMatches = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return allMatches.filter((match) => {
      const matchesStage = stageFilter === 'all' || match.stage === stageFilter;
      const matchesGroup = groupFilter === 'all' || match.group === groupFilter;
      const matchesSearch =
        normalizedSearch === '' ||
        match.team1.toLowerCase().includes(normalizedSearch) ||
        match.team2.toLowerCase().includes(normalizedSearch) ||
        match.team1Code.toLowerCase().includes(normalizedSearch) ||
        match.team2Code.toLowerCase().includes(normalizedSearch) ||
        match.stadium.toLowerCase().includes(normalizedSearch) ||
        match.city.toLowerCase().includes(normalizedSearch);

      return matchesStage && matchesGroup && matchesSearch;
    });
  }, [allMatches, groupFilter, searchTerm, stageFilter]);

  const hasActiveFilters = stageFilter !== 'all' || groupFilter !== 'all' || searchTerm !== '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border py-12 dark:border-white/10">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="w-full whitespace-nowrap text-4xl sm:text-5xl font-bold tracking-wide">
              FIFA World Cup{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                2026 Matches
              </span>
            </h1>
            <p className="whitespace-nowrap text-2xl text-muted-foreground dark:text-gray-300">
              Browse real tournament fixtures by group, stage, team, stadium, or host city.
            </p>
          </div>
        </div>
      </section>  

      <section className="border-b border-border py-8 dark:border-white/10">
        <div className="container">
          <div className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-xl dark:border-white/10 dark:bg-[#10294d] md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground dark:text-gray-200">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search teams, stadiums, or cities..."
                  className="pl-10 dark:border-white/10 dark:bg-[#071d3b] dark:text-white dark:placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground dark:text-gray-200">Tournament Stage</label>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="dark:border-white/10 dark:bg-[#071d3b] dark:text-white">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground dark:text-gray-200">Group</label>
              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger className="dark:border-white/10 dark:bg-[#071d3b] dark:text-white">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>
                      Group {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              disabled={!hasActiveFilters}
              onClick={() => {
                setStageFilter('all');
                setGroupFilter('all');
                setSearchTerm('');
              }}
              className="disabled:opacity-40 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white dark:hover:text-fifa-navy"
            >
              Clear
            </Button>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container">
          <div className="mb-6">
            <p className="text-sm font-medium text-muted-foreground dark:text-gray-300">
              Showing {filteredMatches.length} Match{filteredMatches.length === 1 ? '' : 'es'}
            </p>
          </div>

          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMatches.map((match) => (
                <Card
                  key={match.id}
                  className="flex h-full min-h-[300px] flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[0_18px_45px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-fifa-gold hover:shadow-[0_24px_60px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-[#142d52] dark:text-white dark:shadow-[0_18px_45px_rgba(0,0,0,0.22)] dark:hover:bg-[#183660] dark:hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
                >
                  <div className="mb-7 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Match #{match.matchNumber}</p>
                      <p className="mt-1 text-xs text-muted-foreground dark:text-gray-400">{stageLabel(match.stage)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${availabilityClass[match.availability]}`}>
                      {availabilityLabel[match.availability]}
                    </span>
                  </div>

                  <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="text-center">
                      <p className="text-base font-bold leading-snug text-foreground dark:text-white">{match.team1}</p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground dark:text-gray-400">{match.team1Code}</p>
                    </div>
                    <p className="text-sm font-extrabold text-fifa-gold">VS</p>
                    <div className="text-center">
                      <p className="text-base font-bold leading-snug text-foreground dark:text-white">{match.team2}</p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground dark:text-gray-400">{match.team2Code}</p>
                    </div>
                  </div>

                  <div className="mb-6 space-y-2 text-sm text-muted-foreground dark:text-gray-300">
                    <p>
                      <span className="font-semibold text-foreground dark:text-white">
                        {format(match.matchDate, 'MMM dd, yyyy')}
                      </span>
                      {' at '}
                      <span className="font-semibold text-foreground dark:text-white">
                        {format(match.matchDate, 'HH:mm')}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground dark:text-white">{match.stadium}</span>, {match.city}
                    </p>
                  </div>

                  <Link href={`/matches/${match.id}#ticket-packages`} className="mt-auto">
                    <Button className="mt-auto w-full">
                      View Details
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl p-10 text-center">
              <p className="mb-5 text-muted-foreground">No matches found for those filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setStageFilter('all');
                  setGroupFilter('all');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
