import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { TICKET_CATEGORIES } from '@shared/types';

type MatchForm = {
  matchNumber: string;
  team1: string;
  team1Code: string;
  team2: string;
  team2Code: string;
  stadium: string;
  city: string;
  country: string;
  matchDate: string;
  stage: 'group' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final';
  group: string;
  availability: 'available' | 'limited' | 'sold_out';
};

const emptyMatchForm: MatchForm = {
  matchNumber: '',
  team1: '',
  team1Code: '',
  team2: '',
  team2Code: '',
  stadium: '',
  city: '',
  country: '',
  matchDate: '',
  stage: 'group',
  group: '',
  availability: 'available',
};

const toDateTimeLocalValue = (value: string | Date) => {
  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

export default function AdminDashboard() {
  const [location] = useLocation();
  const getTabFromPath = () => {
    if (location.includes('/admin/packages')) return 'packages';
    if (location.includes('/admin/matches')) return 'matches';
    return 'matches';
  };
  const [activeTab, setActiveTab] = useState(getTabFromPath);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <section className="gradient-fifa text-white py-10 sm:py-12 border-b border-border">
        <div className="container">
          <h1 className="text-3xl padding-10 sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="max-w-3x max-w-full gap-7  text-base sm:text-lg text-gray-100">Manage matches, ticket category pricing, and customer inquiries.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-1 gap-1 p-1 sm:grid-cols-3 sm:gap-0 sm:p-[3px] mb-8">
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="packages">Ticket Categories</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="space-y-8">
              <MatchesAdmin />
            </TabsContent>

            <TabsContent value="packages" className="space-y-8">
              <TicketCategoriesAdmin />
            </TabsContent>

            <TabsContent value="inquiries" className="space-y-8">
              <h2 className="text-2xl font-bold">Customer Inquiries</h2>
              <InquiriesTable />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function MatchesAdmin() {
  const utils = trpc.useUtils();
  const { data: matches, isLoading } = trpc.matches.list.useQuery();
  const createMatch = trpc.matches.create.useMutation();
  const updateMatch = trpc.matches.update.useMutation();
  const deleteMatch = trpc.matches.delete.useMutation();
  const [showForm, setShowForm] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
  const [form, setForm] = useState<MatchForm>(emptyMatchForm);

  const updateField = (field: keyof MatchForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyMatchForm);
    setEditingMatchId(null);
    setShowForm(false);
  };

  const handleEdit = (match: NonNullable<typeof matches>[number]) => {
    setForm({
      matchNumber: String(match.matchNumber),
      team1: match.team1,
      team1Code: match.team1Code,
      team2: match.team2,
      team2Code: match.team2Code,
      stadium: match.stadium,
      city: match.city,
      country: match.country,
      matchDate: toDateTimeLocalValue(match.matchDate),
      stage: match.stage,
      group: match.group || '',
      availability: match.availability,
    });
    setEditingMatchId(match.id);
    setShowForm(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = {
        matchNumber: Number(form.matchNumber),
        team1: form.team1,
        team1Code: form.team1Code.toUpperCase(),
        team2: form.team2,
        team2Code: form.team2Code.toUpperCase(),
        stadium: form.stadium,
        city: form.city,
        country: form.country,
        matchDate: new Date(form.matchDate),
        stage: form.stage,
        group: form.group || undefined,
        availability: form.availability,
      };

      if (editingMatchId) {
        await updateMatch.mutateAsync({ id: editingMatchId, data: payload });
        toast.success('Match updated');
      } else {
        await createMatch.mutateAsync(payload);
        toast.success('Match added');
      }
      resetForm();
      await utils.matches.list.invalidate();
    } catch (error) {
      console.error('Could not save match:', error);
      toast.error('Could not save match. Check the form values and try again.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMatch.mutateAsync({ id });
      toast.success('Match deleted');
      await utils.matches.list.invalidate();
    } catch {
      toast.error('Could not delete match');
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Matches</h2>
          <p className="text-muted-foreground">Add matches and remove old records.</p>
        </div>
        <Button onClick={() => showForm ? resetForm() : setShowForm(true)} className="w-full bg-fifa-navy text-white hover:bg-fifa-gold hover:text-fifa-navy sm:w-auto">
          <Plus className="mr-2 h-5 w-5" />
          Add Match
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input required placeholder="Match number" type="number" value={form.matchNumber} onChange={(e) => updateField('matchNumber', e.target.value)} />
            <Input required placeholder="Match date and time" type="datetime-local" value={form.matchDate} onChange={(e) => updateField('matchDate', e.target.value)} />
            <Input required placeholder="Team 1" value={form.team1} onChange={(e) => updateField('team1', e.target.value)} />
            <Input required placeholder="Team 1 code" maxLength={3} value={form.team1Code} onChange={(e) => updateField('team1Code', e.target.value)} />
            <Input required placeholder="Team 2" value={form.team2} onChange={(e) => updateField('team2', e.target.value)} />
            <Input required placeholder="Team 2 code" maxLength={3} value={form.team2Code} onChange={(e) => updateField('team2Code', e.target.value)} />
            <Input required placeholder="Stadium" value={form.stadium} onChange={(e) => updateField('stadium', e.target.value)} />
            <Input required placeholder="City" value={form.city} onChange={(e) => updateField('city', e.target.value)} />
            <Input required placeholder="Country" value={form.country} onChange={(e) => updateField('country', e.target.value)} />
            <Input placeholder="Group, e.g. A" value={form.group} onChange={(e) => updateField('group', e.target.value.toUpperCase())} />
            <Select value={form.stage} onValueChange={(value) => updateField('stage', value)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="round_of_16">Round of 32</SelectItem>
                <SelectItem value="quarter_final">Quarter Final</SelectItem>
                <SelectItem value="semi_final">Semi Final</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
            <Select value={form.availability} onValueChange={(value) => updateField('availability', value)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="sold_out">Sold Out</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={createMatch.isPending || updateMatch.isPending} className="md:col-span-2 bg-fifa-gold text-fifa-navy hover:bg-fifa-navy hover:text-white">
              {createMatch.isPending || updateMatch.isPending ? 'Saving...' : editingMatchId ? 'Update Match' : 'Save Match'}
            </Button>
          </form>
        </Card>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b-2 border-fifa-navy">
              <th className="text-left py-4 px-4 font-bold">Match</th>
              <th className="text-left py-4 px-4 font-bold">Date</th>
              <th className="text-left py-4 px-4 font-bold">Stadium</th>
              <th className="text-left py-4 px-4 font-bold">Availability</th>
              <th className="text-center py-4 px-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="p-6 text-muted-foreground" colSpan={5}>Loading matches...</td></tr>
            ) : matches && matches.length > 0 ? (
              matches?.map((match) => (
                <tr key={match.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="py-4 px-4 font-semibold">{match.team1} vs {match.team2}</td>
                  <td className="py-4 px-4 text-muted-foreground">{new Date(match.matchDate).toLocaleString()}</td>
                  <td className="py-4 px-4 text-muted-foreground">{match.stadium}</td>
                  <td className="py-4 px-4 text-muted-foreground">{match.availability}</td>
                  <td className="py-4 px-4 text-center">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(match)} className="inline-flex items-center gap-1 text-fifa-navy hover:text-fifa-gold dark:text-white">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(match.id)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td className="p-6 text-muted-foreground" colSpan={5}>No matches available.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}

type TicketCategoryName = (typeof TICKET_CATEGORIES)[number]["name"];

const emptyPriceForm = Object.fromEntries(
  TICKET_CATEGORIES.map((item) => [item.name, String(item.price)])
) as Record<TicketCategoryName, string>;

function TicketCategoriesAdmin() {
  const utils = trpc.useUtils();
  const { data: matches, isLoading: matchesLoading } = trpc.matches.list.useQuery();
  const ensureForMatch = trpc.packages.ensureStandardForMatch.useMutation();
  const ensureForAllMatches = trpc.packages.ensureStandardForAllMatches.useMutation();
  const setPricesForMatch = trpc.packages.setPricesForMatch.useMutation();

  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [prices, setPrices] = useState<Record<TicketCategoryName, string>>(emptyPriceForm);

  const { data: matchPackages, isLoading: packagesLoading } = trpc.packages.getByMatchId.useQuery(
    { matchId: selectedMatchId ?? 0 },
    { enabled: selectedMatchId !== null }
  );

  useEffect(() => {
    if (selectedMatchId === null) return;
    const nextPrices = { ...emptyPriceForm };
    matchPackages?.forEach((pkg) => {
      nextPrices[pkg.category as TicketCategoryName] = String(pkg.price);
    });
    setPrices(nextPrices);
  }, [selectedMatchId, matchPackages]);

  const handleInitializeMatch = async () => {
    if (selectedMatchId === null) return;
    try {
      await ensureForMatch.mutateAsync({ matchId: selectedMatchId });
      await utils.packages.getByMatchId.invalidate({ matchId: selectedMatchId });
      toast.success("Ticket categories initialized");
    } catch {
      toast.error("Could not initialize ticket categories");
    }
  };

  const handleInitializeAll = async () => {
    try {
      await ensureForAllMatches.mutateAsync();
      if (selectedMatchId !== null) {
        await utils.packages.getByMatchId.invalidate({ matchId: selectedMatchId });
      }
      toast.success("Ticket categories initialized for all matches");
    } catch {
      toast.error("Could not initialize categories for all matches");
    }
  };

  const handleSavePrices = async () => {
    if (selectedMatchId === null) return;
    try {
      await setPricesForMatch.mutateAsync({
        matchId: selectedMatchId,
        prices: TICKET_CATEGORIES.map((item) => ({
          category: item.name,
          price: Number(prices[item.name]),
        })),
      });
      await utils.packages.getByMatchId.invalidate({ matchId: selectedMatchId });
      toast.success("Prices updated");
    } catch {
      toast.error("Could not update prices");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ticket Category Prices</h2>
          <p className="text-muted-foreground">Each match has 4 standard ticket categories. Update prices per match.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={ensureForAllMatches.isPending || matchesLoading}
          onClick={handleInitializeAll}
          className="w-full sm:w-auto"
        >
          {ensureForAllMatches.isPending ? "Initializing..." : "Initialize All Matches"}
        </Button>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2">
            <p className="text-sm font-medium">Select match</p>
            <Select
              value={selectedMatchId ? String(selectedMatchId) : ""}
              onValueChange={(value) => setSelectedMatchId(Number(value))}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Choose match" /></SelectTrigger>
              <SelectContent>
                {matches && matches.length > 0 ? matches.map((match) => (
                  <SelectItem key={match.id} value={String(match.id)}>
                    Match #{match.matchNumber}: {match.team1} vs {match.team2}
                  </SelectItem>
                )) : (
                  <SelectItem value="no-matches" disabled>No matches available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            onClick={handleInitializeMatch}
            disabled={selectedMatchId === null || ensureForMatch.isPending || packagesLoading}
            className="bg-fifa-navy text-white hover:bg-fifa-gold hover:text-fifa-navy"
          >
            {ensureForMatch.isPending ? "Initializing..." : "Initialize Match"}
          </Button>
        </div>
      </Card>

      {selectedMatchId !== null && (
        <Card className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {TICKET_CATEGORIES.map((category) => (
              <div key={category.id} className="space-y-2">
                <p className="text-sm font-medium">{category.name}</p>
                <Input
                  type="number"
                  step="0.01"
                  value={prices[category.name]}
                  onChange={(e) =>
                    setPrices((current) => ({ ...current, [category.name]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={handleSavePrices}
            disabled={setPricesForMatch.isPending || packagesLoading}
            className="mt-6 w-full bg-fifa-gold text-fifa-navy hover:bg-fifa-navy hover:text-white"
          >
            {setPricesForMatch.isPending ? "Saving..." : "Save Prices"}
          </Button>
        </Card>
      )}
    </>
  );
}

function InquiriesTable() {
  const { data: inquiries, isLoading } = trpc.inquiries.list.useQuery();
  const updateStatus = trpc.inquiries.updateStatus.useMutation();

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        id,
        status: newStatus as 'new' | 'contacted' | 'resolved',
      });
      toast.success('Status updated successfully');
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return <Card className="p-8 text-center text-muted-foreground">Loading inquiries...</Card>;
  }

  return (
      <Card className="overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="border-b-2 border-fifa-navy">
            <th className="text-left py-4 px-4 font-bold">Name</th>
            <th className="text-left py-4 px-4 font-bold">Email</th>
            <th className="text-left py-4 px-4 font-bold">Phone</th>
            <th className="text-left py-4 px-4 font-bold">Status</th>
            <th className="text-left py-4 px-4 font-bold">Date</th>
          </tr>
        </thead>
        <tbody>
          {inquiries?.map((inquiry) => (
            <tr key={inquiry.id} className="border-b border-border hover:bg-muted transition-colors">
              <td className="py-4 px-4 font-semibold">{inquiry.name}</td>
              <td className="py-4 px-4 text-muted-foreground">{inquiry.email}</td>
              <td className="py-4 px-4 text-muted-foreground">{inquiry.phone}</td>
              <td className="py-4 px-4">
                <Select value={inquiry.status} onValueChange={(value) => handleStatusChange(inquiry.id, value)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="py-4 px-4 text-muted-foreground">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
