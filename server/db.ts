import { Pool } from "pg";
import type { QueryResultRow } from "pg";
import { ENV } from "./_core/env";

type UserRole = "user" | "admin";
type MatchStage = "group" | "round_of_16" | "quarter_final" | "semi_final" | "final";
type Availability = "available" | "limited" | "sold_out";
type TicketCategory = "Category 1" | "Category 2" | "Category 3" | "Category 4";
type InquiryStatus = "new" | "contacted" | "resolved";

export type User = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
};

export type InsertUser = {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: UserRole;
  lastSignedIn?: Date;
};

type LocalMatch = {
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
  stage: MatchStage;
  group: string | null;
  availability: Availability;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type LocalPackage = {
  id: number;
  matchId: number;
  category: TicketCategory;
  description: string | null;
  price: string;
  currency: string;
  quantity: number;
  quantitySold: number;
  benefits: string | null;
  seatType: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type CustomerInquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  matchId: number | null;
  ticketCategoryId: number | null;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
};

const now = () => new Date();
let pool: Pool | null = null;

const createLocalMatch = (
  id: number,
  data: Omit<LocalMatch, "id" | "createdAt" | "updatedAt" | "imageUrl"> & { imageUrl?: string | null }
): LocalMatch => ({
  ...data,
  id,
  imageUrl: data.imageUrl ?? null,
  createdAt: now(),
  updatedAt: now(),
});

let localMatches: LocalMatch[] = [
  createLocalMatch(1, { matchNumber: 1, team1: "Mexico", team1Code: "MEX", team2: "South Africa", team2Code: "RSA", stadium: "Mexico City Stadium", city: "Mexico City", country: "Mexico", matchDate: new Date("2026-06-11T13:00:00"), stage: "group", group: "A", availability: "available" }),
  createLocalMatch(2, { matchNumber: 2, team1: "Korea Republic", team1Code: "KOR", team2: "Czechia", team2Code: "CZE", stadium: "Estadio Guadalajara", city: "Guadalajara", country: "Mexico", matchDate: new Date("2026-06-11T20:00:00"), stage: "group", group: "A", availability: "limited" }),
  createLocalMatch(3, { matchNumber: 3, team1: "Canada", team1Code: "CAN", team2: "Bosnia and Herzegovina", team2Code: "BIH", stadium: "Toronto Stadium", city: "Toronto", country: "Canada", matchDate: new Date("2026-06-12T15:00:00"), stage: "group", group: "B", availability: "available" }),
  createLocalMatch(4, { matchNumber: 4, team1: "United States", team1Code: "USA", team2: "Paraguay", team2Code: "PAR", stadium: "Los Angeles Stadium", city: "Los Angeles", country: "United States", matchDate: new Date("2026-06-12T18:00:00"), stage: "group", group: "D", availability: "limited" }),
  createLocalMatch(5, { matchNumber: 5, team1: "Haiti", team1Code: "HAI", team2: "Scotland", team2Code: "SCO", stadium: "Boston Stadium", city: "Boston", country: "United States", matchDate: new Date("2026-06-13T12:00:00"), stage: "group", group: "C", availability: "available" }),
  createLocalMatch(6, { matchNumber: 6, team1: "Australia", team1Code: "AUS", team2: "Turkiye", team2Code: "TUR", stadium: "BC Place Vancouver", city: "Vancouver", country: "Canada", matchDate: new Date("2026-06-13T15:00:00"), stage: "group", group: "D", availability: "available" }),
  createLocalMatch(7, { matchNumber: 7, team1: "Brazil", team1Code: "BRA", team2: "Morocco", team2Code: "MAR", stadium: "New York New Jersey Stadium", city: "New York New Jersey", country: "United States", matchDate: new Date("2026-06-13T18:00:00"), stage: "group", group: "C", availability: "sold_out" }),
  createLocalMatch(8, { matchNumber: 8, team1: "Qatar", team1Code: "QAT", team2: "Switzerland", team2Code: "SUI", stadium: "San Francisco Bay Area Stadium", city: "San Francisco Bay Area", country: "United States", matchDate: new Date("2026-06-13T20:00:00"), stage: "group", group: "B", availability: "available" }),
];

let localPackages: LocalPackage[] = [];
let localInquiries: CustomerInquiry[] = [];
let nextLocalMatchId = Math.max(...localMatches.map(match => match.id)) + 1;
let nextLocalPackageId = 1;
let nextLocalInquiryId = 1;

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    let connectionString = process.env.DATABASE_URL;
    const isRemote =
      connectionString.includes("supabase.com") ||
      connectionString.includes("sslmode=");

    if (isRemote) {
      // pg treats sslmode=require as verify-full; strip it and set SSL explicitly for Supabase.
      connectionString = connectionString
        .replace(/([?&])sslmode=[^&]*&?/g, "$1")
        .replace(/[?&]$/, "");
    }

    pool = new Pool({
      connectionString,
      ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
    });
  }
  return pool;
}

function sortLocalMatches() {
  return [...localMatches].sort((a, b) => a.matchDate.getTime() - b.matchDate.getTime());
}

async function query<T extends QueryResultRow>(sql: string, values: unknown[] = []) {
  const db = getPool();
  if (!db) return null;

  try {
    return await db.query<T>(sql, values);
  } catch (error) {
    console.warn("[Database] Query failed:", error);
    return null;
  }
}

export async function upsertUser(user: InsertUser): Promise<User | null> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const localEmail = user.openId.startsWith("local:") ? user.openId.slice("local:".length) : null;
  const email = user.email ?? localEmail;
  const name = user.name ?? (localEmail ? localEmail.split("@")[0] : null);
  const loginMethod = user.loginMethod ?? (localEmail ? "login" : null);
  const role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : null);
  const result = await query<User>(
    `
      INSERT INTO "users" ("openId", "name", "email", "loginMethod", "role", "lastSignedIn", "updatedAt")
      VALUES ($1, $2, $3, $4, COALESCE($5, 'user'), $6, now())
      ON CONFLICT ("openId") DO UPDATE SET
        "name" = COALESCE(EXCLUDED."name", "users"."name"),
        "email" = COALESCE(EXCLUDED."email", "users"."email"),
        "loginMethod" = COALESCE(EXCLUDED."loginMethod", "users"."loginMethod"),
        "role" = COALESCE($5, "users"."role"),
        "lastSignedIn" = EXCLUDED."lastSignedIn",
        "updatedAt" = now()
      RETURNING *
    `,
    [user.openId, name, email, loginMethod, role, user.lastSignedIn ?? new Date()]
  );

  if (!result) console.warn("[Database] Cannot upsert user: database not available");
  return result?.rows[0] ?? null;
}

export async function getUserByOpenId(openId: string) {
  const result = await query<User>(`SELECT * FROM "users" WHERE "openId" = $1 LIMIT 1`, [openId]);
  return result?.rows[0];
}

export async function getAllMatches() {
  const result = await query<LocalMatch>(`SELECT * FROM "matches" ORDER BY "matchDate"`);
  return result && result.rows.length > 0 ? result.rows : sortLocalMatches();
}

export async function getMatchById(id: number) {
  const result = await query<LocalMatch>(`SELECT * FROM "matches" WHERE "id" = $1 LIMIT 1`, [id]);
  return result?.rows[0] ?? localMatches.find(match => match.id === id);
}

export async function getMatchesByStage(stage: string) {
  const fallback = sortLocalMatches().filter(match => match.stage === stage);
  const result = await query<LocalMatch>(`SELECT * FROM "matches" WHERE "stage" = $1 ORDER BY "matchDate"`, [stage]);
  return result && result.rows.length > 0 ? result.rows : fallback;
}

export async function getMatchesByGroup(group: string) {
  const fallback = sortLocalMatches().filter(match => match.group === group);
  const result = await query<LocalMatch>(`SELECT * FROM "matches" WHERE "group" = $1 ORDER BY "matchDate"`, [group]);
  return result && result.rows.length > 0 ? result.rows : fallback;
}

export async function createMatch(data: any) {
  const createdLocal = () => {
    const created = createLocalMatch(nextLocalMatchId++, {
      matchNumber: data.matchNumber,
      team1: data.team1,
      team1Code: data.team1Code,
      team2: data.team2,
      team2Code: data.team2Code,
      stadium: data.stadium,
      city: data.city,
      country: data.country,
      matchDate: new Date(data.matchDate),
      stage: data.stage,
      group: data.group ?? null,
      availability: data.availability ?? "available",
      imageUrl: data.imageUrl ?? null,
    });
    localMatches = [...localMatches, created];
    return created;
  };

  const result = await query<LocalMatch>(
    `
      INSERT INTO "matches" ("matchNumber", "team1", "team1Code", "team2", "team2Code", "stadium", "city", "country", "matchDate", "stage", "group", "availability", "imageUrl", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now())
      RETURNING *
    `,
    [data.matchNumber, data.team1, data.team1Code, data.team2, data.team2Code, data.stadium, data.city, data.country, data.matchDate, data.stage, data.group ?? null, data.availability ?? "available", data.imageUrl ?? null]
  );

  return result?.rows[0] ?? createdLocal();
}

export async function updateMatch(id: number, data: any) {
  const result = await query<LocalMatch>(
    `
      UPDATE "matches" SET
        "matchNumber" = COALESCE($2, "matchNumber"),
        "team1" = COALESCE($3, "team1"),
        "team1Code" = COALESCE($4, "team1Code"),
        "team2" = COALESCE($5, "team2"),
        "team2Code" = COALESCE($6, "team2Code"),
        "stadium" = COALESCE($7, "stadium"),
        "city" = COALESCE($8, "city"),
        "country" = COALESCE($9, "country"),
        "matchDate" = COALESCE($10, "matchDate"),
        "stage" = COALESCE($11, "stage"),
        "group" = COALESCE($12, "group"),
        "availability" = COALESCE($13, "availability"),
        "imageUrl" = COALESCE($14, "imageUrl"),
        "updatedAt" = now()
      WHERE "id" = $1
      RETURNING *
    `,
    [
      id,
      data.matchNumber ?? null,
      data.team1 ?? null,
      data.team1Code ?? null,
      data.team2 ?? null,
      data.team2Code ?? null,
      data.stadium ?? null,
      data.city ?? null,
      data.country ?? null,
      data.matchDate ?? null,
      data.stage ?? null,
      data.group ?? null,
      data.availability ?? null,
      data.imageUrl ?? null,
    ]
  );

  if (result) return result.rows[0];

  localMatches = localMatches.map(match =>
    match.id === id ? { ...match, ...data, matchDate: data.matchDate ? new Date(data.matchDate) : match.matchDate, updatedAt: now() } : match
  );
  return localMatches.find(match => match.id === id);
}

export async function deleteMatch(id: number) {
  const result = await query(`DELETE FROM "matches" WHERE "id" = $1`, [id]);
  if (!result) {
    localMatches = localMatches.filter(match => match.id !== id);
    localPackages = localPackages.filter(pkg => pkg.matchId !== id);
  }
  return { success: true };
}

export async function getPackagesByMatchId(matchId: number) {
  const fallback = localPackages.filter(pkg => pkg.matchId === matchId);
  const result = await query<LocalPackage>(`SELECT * FROM "ticketPackages" WHERE "matchId" = $1`, [matchId]);
  return result && result.rows.length > 0 ? result.rows : fallback;
}

export async function getPackageById(id: number) {
  const result = await query<LocalPackage>(`SELECT * FROM "ticketPackages" WHERE "id" = $1 LIMIT 1`, [id]);
  return result?.rows[0] ?? localPackages.find(pkg => pkg.id === id);
}

export async function getAllPackages() {
  const result = await query<LocalPackage>(`SELECT * FROM "ticketPackages" ORDER BY "id"`);
  return result && result.rows.length > 0 ? result.rows : localPackages;
}

export async function createPackage(data: any) {
  const createdLocal = () => {
    const created: LocalPackage = {
      id: nextLocalPackageId++,
      matchId: data.matchId,
      category: data.category,
      description: data.description ?? null,
      price: String(data.price),
      currency: data.currency ?? "USD",
      quantity: data.quantity,
      quantitySold: data.quantitySold ?? 0,
      benefits: data.benefits ?? null,
      seatType: data.seatType ?? null,
      createdAt: now(),
      updatedAt: now(),
    };
    localPackages = [...localPackages, created];
    return created;
  };

  const result = await query<LocalPackage>(
    `
      INSERT INTO "ticketPackages" ("matchId", "category", "description", "price", "currency", "quantity", "quantitySold", "benefits", "seatType", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
      RETURNING *
    `,
    [data.matchId, data.category, data.description ?? null, data.price, data.currency ?? "USD", data.quantity, data.quantitySold ?? 0, data.benefits ?? null, data.seatType ?? null]
  );

  return result?.rows[0] ?? createdLocal();
}

export async function updatePackage(id: number, data: any) {
  const result = await query<LocalPackage>(
    `
      UPDATE "ticketPackages" SET
        "category" = COALESCE($2, "category"),
        "description" = COALESCE($3, "description"),
        "price" = COALESCE($4, "price"),
        "currency" = COALESCE($5, "currency"),
        "quantity" = COALESCE($6, "quantity"),
        "quantitySold" = COALESCE($7, "quantitySold"),
        "benefits" = COALESCE($8, "benefits"),
        "seatType" = COALESCE($9, "seatType"),
        "updatedAt" = now()
      WHERE "id" = $1
      RETURNING *
    `,
    [
      id,
      data.category ?? null,
      data.description ?? null,
      data.price ?? null,
      data.currency ?? null,
      data.quantity ?? null,
      data.quantitySold ?? null,
      data.benefits ?? null,
      data.seatType ?? null,
    ]
  );

  if (result) return result.rows[0];

  localPackages = localPackages.map(pkg => pkg.id === id ? { ...pkg, ...data, price: data.price === undefined ? pkg.price : String(data.price), updatedAt: now() } : pkg);
  return localPackages.find(pkg => pkg.id === id);
}

export async function deletePackage(id: number) {
  const result = await query(`DELETE FROM "ticketPackages" WHERE "id" = $1`, [id]);
  if (!result) localPackages = localPackages.filter(pkg => pkg.id !== id);
  return { success: true };
}

export async function getAllInquiries() {
  const result = await query<CustomerInquiry>(`SELECT * FROM "customerInquiries" ORDER BY "createdAt" DESC`);
  return result?.rows ?? [...localInquiries].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getInquiriesByStatus(status: string) {
  const result = await query<CustomerInquiry>(`SELECT * FROM "customerInquiries" WHERE "status" = $1 ORDER BY "createdAt" DESC`, [status]);
  return result?.rows ?? [...localInquiries]
    .filter(inq => inq.status === status)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createInquiry(data: any) {
  const createdLocal = (): CustomerInquiry => {
    const created: CustomerInquiry = {
      id: nextLocalInquiryId++,
      name: data.name,
      email: data.email,
      phone: data.phone,
      matchId: data.matchId ?? null,
      ticketCategoryId: data.ticketCategoryId ?? null,
      message: data.message,
      status: 'new',
      createdAt: now(),
      updatedAt: now(),
    };
    localInquiries = [...localInquiries, created];
    return created;
  };

  const result = await query(
    `
      INSERT INTO "customerInquiries" ("name", "email", "phone", "matchId", "ticketCategoryId", "message", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, now())
      RETURNING *
    `,
    [data.name, data.email, data.phone, data.matchId ?? null, data.ticketCategoryId ?? null, data.message]
  );

  return result?.rows[0] ?? createdLocal();
}

export async function updateInquiry(id: number, data: { status?: InquiryStatus }) {
  const result = await query(
    `UPDATE "customerInquiries" SET "status" = COALESCE($2, "status"), "updatedAt" = now() WHERE "id" = $1 RETURNING *`,
    [id, data.status ?? null]
  );

  if (result) return result.rows[0];

  localInquiries = localInquiries.map(inq =>
    inq.id === id ? { ...inq, status: data.status ?? inq.status, updatedAt: now() } : inq
  );
  return localInquiries.find(inq => inq.id === id);
}

export async function deleteInquiry(id: number) {
  const result = await query(`DELETE FROM "customerInquiries" WHERE "id" = $1`, [id]);
  if (!result) localInquiries = localInquiries.filter(inq => inq.id !== id);
  return { success: true };
}
