-- FIFA Ticket Hub complete PostgreSQL setup.
-- Run this once after creating your database.

DO $$ BEGIN
  CREATE TYPE "match_stage" AS ENUM ('group', 'round_of_16', 'quarter_final', 'semi_final', 'final');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "match_availability" AS ENUM ('available', 'limited', 'sold_out');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ticket_category" AS ENUM ('Category 1', 'Category 2', 'Category 3', 'Category 4');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "inquiry_status" AS ENUM ('new', 'contacted', 'resolved');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY,
  "openId" varchar(64) NOT NULL UNIQUE,
  "name" text,
  "email" varchar(320),
  "loginMethod" varchar(64),
  "role" varchar(20) DEFAULT 'user' NOT NULL CHECK ("role" IN ('admin', 'user')),
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "lastSignedIn" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "matches" (
  "id" serial PRIMARY KEY,
  "matchNumber" integer NOT NULL,
  "team1" varchar(100) NOT NULL,
  "team1Code" varchar(3) NOT NULL,
  "team2" varchar(100) NOT NULL,
  "team2Code" varchar(3) NOT NULL,
  "stadium" varchar(200) NOT NULL,
  "city" varchar(100) NOT NULL,
  "country" varchar(100) NOT NULL,
  "matchDate" timestamp NOT NULL,
  "stage" "match_stage" NOT NULL,
  "group" varchar(10),
  "availability" "match_availability" DEFAULT 'available' NOT NULL,
  "imageUrl" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ticketPackages" (
  "id" serial PRIMARY KEY,
  "matchId" integer NOT NULL,
  "category" "ticket_category" NOT NULL,
  "description" text,
  "price" numeric(10, 2) NOT NULL,
  "currency" varchar(3) DEFAULT 'USD' NOT NULL,
  "quantity" integer NOT NULL,
  "quantitySold" integer DEFAULT 0 NOT NULL,
  "benefits" text,
  "seatType" varchar(100),
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "customerInquiries" (
  "id" serial PRIMARY KEY,
  "name" varchar(200) NOT NULL,
  "email" varchar(320) NOT NULL,
  "phone" varchar(20) NOT NULL,
  "matchId" integer,
  "ticketCategoryId" integer,
  "message" text NOT NULL,
  "status" "inquiry_status" DEFAULT 'new' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "matches"
  ("matchNumber", "team1", "team1Code", "team2", "team2Code", "stadium", "city", "country", "matchDate", "stage", "group", "availability")
VALUES
  (1, 'Mexico', 'MEX', 'South Africa', 'RSA', 'Mexico City Stadium', 'Mexico City', 'Mexico', '2026-06-11 13:00:00', 'group', 'A', 'available'),
  (2, 'Korea Republic', 'KOR', 'Czechia', 'CZE', 'Estadio Guadalajara', 'Guadalajara', 'Mexico', '2026-06-11 20:00:00', 'group', 'A', 'limited'),
  (3, 'Canada', 'CAN', 'Bosnia and Herzegovina', 'BIH', 'Toronto Stadium', 'Toronto', 'Canada', '2026-06-12 15:00:00', 'group', 'B', 'available'),
  (4, 'United States', 'USA', 'Paraguay', 'PAR', 'Los Angeles Stadium', 'Los Angeles', 'United States', '2026-06-12 18:00:00', 'group', 'D', 'limited'),
  (5, 'Haiti', 'HAI', 'Scotland', 'SCO', 'Boston Stadium', 'Boston', 'United States', '2026-06-13 12:00:00', 'group', 'C', 'available'),
  (6, 'Australia', 'AUS', 'Turkiye', 'TUR', 'BC Place Vancouver', 'Vancouver', 'Canada', '2026-06-13 15:00:00', 'group', 'D', 'available'),
  (7, 'Brazil', 'BRA', 'Morocco', 'MAR', 'New York New Jersey Stadium', 'New York New Jersey', 'United States', '2026-06-13 18:00:00', 'group', 'C', 'sold_out'),
  (8, 'Qatar', 'QAT', 'Switzerland', 'SUI', 'San Francisco Bay Area Stadium', 'San Francisco Bay Area', 'United States', '2026-06-13 20:00:00', 'group', 'B', 'available')
ON CONFLICT DO NOTHING;

-- After you register or log in once, replace the email below and run this line.
-- UPDATE "users"
-- SET "role" = 'admin'
-- WHERE "email" = 'your-email@example.com';
