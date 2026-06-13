import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { Edit, PackageCheck, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

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

type PackageForm = {
  matchId: string;
  category: 'Category 1' | 'Category 2' | 'Category 3' | 'Category 4';
  description: string;
  price: string;
  currency: string;
  quantity: string;
  benefits: string;
  seatType: string;
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

const emptyPackageForm: PackageForm = {
  matchId: '',
  category: 'Category 1',
  description: '',
  price: '',
  currency: 'USD',
  quantity: '',
  benefits: '',
  seatType: '',
};

const packageCategories = [
  {
    category: 'Category 1',
    seatType: 'Premium Lower',
    description: 'Premium seats closest to the pitch.',
  },
  {
    category: 'Category 2',
    seatType: 'Mid-Level',
    description: 'Balanced comfort, view quality, and value.',
  },
  {
    category: 'Category 3',
    seatType: 'Upper Level',
    description: 'Accessible matchday seats with reliable views.',
  },
  {
    category: 'Category 4',
    seatType: 'General',
    description: 'Budget-friendly standard stadium access.',
  },
] as const;

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
          <p className="max-w-3x max-w-full gap-7  text-base sm:text-lg text-gray-100">Manage matches, ticket packages, and customer inquiries.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-1 gap-1 p-1 sm:grid-cols-3 sm:gap-0 sm:p-[3px] mb-8">
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="space-y-8">
              <MatchesAdmin />
            </TabsContent>

            <TabsContent value="packages" className="space-y-8">
              <PackagesAdmin />
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
                <SelectItem value="round_of_16">Round of 16</SelectItem>
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

function PackagesAdmin() {
  const utils = trpc.useUtils();
  const { data: matches } = trpc.matches.list.useQuery();
  const { data: packages, isLoading } = trpc.packages.list.useQuery();
  const createPackage = trpc.packages.create.useMutation();
  const updatePackage = trpc.packages.update.useMutation();
  const deletePackage = trpc.packages.delete.useMutation();
  const [showForm, setShowForm] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<number | null>(null);
  const [form, setForm] = useState<PackageForm>(emptyPackageForm);

  const updateField = (field: keyof PackageForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyPackageForm);
    setEditingPackageId(null);
    setShowForm(false);
  };

  const handleEdit = (pkg: NonNullable<typeof packages>[number]) => {
    setForm({
      matchId: String(pkg.matchId),
      category: pkg.category,
      description: pkg.description || '',
      price: String(pkg.price),
      currency: pkg.currency,
      quantity: String(pkg.quantity),
      benefits: pkg.benefits ? JSON.parse(pkg.benefits).join('\n') : '',
      seatType: pkg.seatType || '',
    });
    setEditingPackageId(pkg.id);
    setShowForm(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const benefits = form.benefits
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        matchId: Number(form.matchId),
        category: form.category,
        description: form.description || undefined,
        price: Number(form.price),
        currency: form.currency || 'USD',
        quantity: Number(form.quantity),
        benefits: benefits.length ? JSON.stringify(benefits) : undefined,
        seatType: form.seatType || undefined,
      };

      if (editingPackageId) {
        const { matchId: _matchId, ...data } = payload;
        await updatePackage.mutateAsync({ id: editingPackageId, data });
        toast.success('Package updated');
      } else {
        await createPackage.mutateAsync(payload);
        toast.success('Package added');
      }
      resetForm();
      await utils.packages.list.invalidate();
    } catch (error) {
      console.error('Could not save package:', error);
      toast.error('Could not save package. Select a match and check the form values.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePackage.mutateAsync({ id });
      toast.success('Package deleted');
      await utils.packages.list.invalidate();
    } catch {
      toast.error('Could not delete package');
    }
  };

  const packageSummary = packageCategories.map((item) => {
    const categoryPackages = packages?.filter((pkg) => pkg.category === item.category) || [];
    const totalQuantity = categoryPackages.reduce((sum, pkg) => sum + pkg.quantity, 0);
    const availableQuantity = categoryPackages.reduce((sum, pkg) => sum + Math.max(pkg.quantity - pkg.quantitySold, 0), 0);

    return {
      ...item,
      packageCount: categoryPackages.length,
      totalQuantity,
      availableQuantity,
    };
  });

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Ticket Packages</h2>
          <p className="text-muted-foreground">The system supports 4 package categories. Review existing packages and availability.</p>
        </div>
        <Button onClick={() => showForm ? resetForm() : setShowForm(true)} className="w-full bg-fifa-navy text-white hover:bg-fifa-gold hover:text-fifa-navy sm:w-auto">
          <Plus className="mr-2 h-5 w-5" />
          Add Package
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {packageSummary.map((item) => (
          <Card key={item.category} className="p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{item.category}</h3>
                <p className="text-sm text-muted-foreground">{item.seatType}</p>
              </div>
              <PackageCheck className="h-5 w-5 shrink-0 text-fifa-gold" />
            </div>
            <p className="min-h-10 text-sm text-muted-foreground">{item.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xl font-bold text-fifa-navy dark:text-white">{item.packageCount}</p>
                <p className="text-xs text-muted-foreground">Packages</p>
              </div>
              <div>
                <p className="text-xl font-bold text-fifa-navy dark:text-white">{item.totalQuantity}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-xl font-bold text-fifa-navy dark:text-white">{item.availableQuantity}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Select value={form.matchId} onValueChange={(value) => updateField('matchId', value)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select match" /></SelectTrigger>
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
            <Select value={form.category} onValueChange={(value) => updateField('category', value)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Category 1">Category 1</SelectItem>
                <SelectItem value="Category 2">Category 2</SelectItem>
                <SelectItem value="Category 3">Category 3</SelectItem>
                <SelectItem value="Category 4">Category 4</SelectItem>
              </SelectContent>
            </Select>
            <Input required placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => updateField('price', e.target.value)} />
            <Input required placeholder="Quantity" type="number" value={form.quantity} onChange={(e) => updateField('quantity', e.target.value)} />
            <Input placeholder="Currency" value={form.currency} onChange={(e) => updateField('currency', e.target.value.toUpperCase())} />
            <Input placeholder="Seat type" value={form.seatType} onChange={(e) => updateField('seatType', e.target.value)} />
            <Textarea className="md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
            <Textarea className="md:col-span-2" placeholder="Benefits, one per line" value={form.benefits} onChange={(e) => updateField('benefits', e.target.value)} />
            <Button type="submit" disabled={createPackage.isPending || updatePackage.isPending || !form.matchId || form.matchId === 'no-matches'} className="md:col-span-2 bg-fifa-gold text-fifa-navy hover:bg-fifa-navy hover:text-white">
              {createPackage.isPending || updatePackage.isPending ? 'Saving...' : editingPackageId ? 'Update Package' : 'Save Package'}
            </Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4 md:hidden">
        {isLoading ? (
          <Card className="p-6 text-muted-foreground">Loading packages...</Card>
        ) : packages && packages.length > 0 ? (
          packages.map((pkg) => {
            const match = matches?.find((item) => item.id === pkg.matchId);
            const available = pkg.quantity - pkg.quantitySold;

            return (
              <Card key={pkg.id} className="p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{pkg.category}</h3>
                    <p className="text-sm text-muted-foreground">{match ? `${match.team1} vs ${match.team2}` : `Match #${pkg.matchId}`}</p>
                  </div>
                  <p className="shrink-0 text-right font-semibold text-fifa-navy dark:text-white">{pkg.price} {pkg.currency}</p>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Available</p>
                    <p className="font-semibold">{available}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Seat Type</p>
                    <p className="font-semibold">{pkg.seatType || 'Not set'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(pkg)} className="mb-2 w-full justify-center text-fifa-navy hover:text-fifa-gold dark:text-white">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(pkg.id)} className="w-full justify-center text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </Card>
            );
          })
        ) : (
          <Card className="p-6 text-muted-foreground">No packages available.</Card>
        )}
      </div>

      <Card className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b-2 border-fifa-navy">
              <th className="text-left py-4 px-4 font-bold">Category</th>
              <th className="text-left py-4 px-4 font-bold">Match</th>
              <th className="text-left py-4 px-4 font-bold">Price</th>
              <th className="text-left py-4 px-4 font-bold">Available</th>
              <th className="text-center py-4 px-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="p-6 text-muted-foreground" colSpan={5}>Loading packages...</td></tr>
            ) : packages && packages.length > 0 ? (
              packages?.map((pkg) => {
                const match = matches?.find((item) => item.id === pkg.matchId);
                return (
                  <tr key={pkg.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="py-4 px-4 font-semibold">{pkg.category}</td>
                    <td className="py-4 px-4 text-muted-foreground">{match ? `${match.team1} vs ${match.team2}` : `Match #${pkg.matchId}`}</td>
                    <td className="py-4 px-4 text-muted-foreground">{pkg.price} {pkg.currency}</td>
                    <td className="py-4 px-4 text-muted-foreground">{pkg.quantity - pkg.quantitySold}</td>
                    <td className="py-4 px-4 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(pkg)} className="inline-flex items-center gap-1 text-fifa-navy hover:text-fifa-gold dark:text-white">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(pkg.id)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td className="p-6 text-muted-foreground" colSpan={5}>No packages available.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
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
