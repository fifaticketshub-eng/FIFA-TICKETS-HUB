-- Adds role-based authorization support for PostgreSQL.
-- Compatible with managed PostgreSQL and future Supabase migration.

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "role" VARCHAR(20) DEFAULT 'user' NOT NULL;

ALTER TABLE "users"
DROP CONSTRAINT IF EXISTS "users_role_check";

ALTER TABLE "users"
ADD CONSTRAINT "users_role_check"
CHECK ("role" IN ('admin', 'user'));

UPDATE "users"
SET "role" = 'user'
WHERE "role" IS NULL;

-- Replace this email with your own account email after you have logged in once.
-- UPDATE "users"
-- SET "role" = 'admin'
-- WHERE "email" = 'myemail@example.com';
