# Admin Role Security Implementation

## Modified Files

- `server/_core/trpc.ts`
  - Added reusable `requireAdmin` middleware.
  - Added `adminProcedure` for protected admin-only tRPC endpoints.

- `server/routers.ts`
  - Replaced the local public admin procedure with the real protected `adminProcedure`.
  - Protected match create/update/delete endpoints.
  - Protected package create/update/delete endpoints.
  - Protected admin inquiry endpoints.

- `server/db.ts`
  - Preserves manually assigned admin roles during user login sync.
  - Keeps new users as `user` by default.
  - Persists match updates to PostgreSQL.
  - Persists package updates to PostgreSQL.

- `client/src/components/Navigation.tsx`
  - Fetches the logged-in user with `trpc.auth.me`.
  - Shows the Admin button only when `user.role === 'admin'`.
  - Hides admin mobile navigation links for guests and normal users.

- `client/src/App.tsx`
  - Added protected admin routes:
    - `/admin`
    - `/admin/matches`
    - `/admin/packages`
  - Redirects guests and non-admin users to `/`.

- `client/src/pages/AdminDashboard.tsx`
  - Supports admin create/edit/delete for matches.
  - Supports admin create/edit/delete for ticket packages.
  - Keeps package management responsive.

- `POSTGRES_SETUP.sql`
  - Fresh database setup now includes a PostgreSQL-compatible `role` column.

- `migrations/20260610_add_user_roles.sql`
  - Standalone migration for existing databases.

## SQL Scripts

### Existing Database Migration

Run this in pgAdmin if your `users` table already exists:

```sql
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
```

### Make Your Account Admin

First, register or log in once with the email address you want to use as the administrator.
Then run this in pgAdmin, replacing the email with your real login email:

```sql
UPDATE "users"
SET "role" = 'admin'
WHERE "email" = 'your-email@example.com';
```

To confirm it worked:

```sql
SELECT "id", "email", "role"
FROM "users"
WHERE "email" = 'your-email@example.com';
```

If you are not sure which email was saved by the login provider, run:

```sql
SELECT "id", "name", "email", "role", "lastSignedIn"
FROM "users"
ORDER BY "lastSignedIn" DESC;
```

## Middleware Code

The reusable middleware is in `server/_core/trpc.ts`:

```ts
export const requireAdmin = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user || ctx.user.role !== 'admin') {
    throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const adminProcedure = t.procedure.use(requireAdmin);
```

Example backend usage:

```ts
create: adminProcedure
  .input(createMatchSchema)
  .mutation(async ({ input }) => {
    return db.createMatch(input);
  });
```

## Frontend Changes

### Navbar Protection

The navbar checks the current user:

```ts
const { data: user } = trpc.auth.me.useQuery();
const isAdmin = user?.role === 'admin';
```

The Admin button only renders for admins:

```tsx
{isAdmin && (
  <Link href="/admin">
    <Button>Admin</Button>
  </Link>
)}
```

### Route Protection

The app protects admin routes in `client/src/App.tsx`:

```tsx
function AdminRoute() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      setLocation("/");
    }
  }, [isAdmin, isLoading, setLocation]);

  if (isLoading) return <div>Checking access...</div>;
  if (!isAdmin) return null;

  return <AdminDashboard />;
}
```

Protected routes:

```tsx
<Route path={"/admin"} component={AdminRoute} />
<Route path={"/admin/matches"} component={AdminRoute} />
<Route path={"/admin/packages"} component={AdminRoute} />
```

## Backend Changes

Admin endpoints now use `adminProcedure`:

```ts
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
```

Protected match endpoints:

```ts
matches: router({
  create: adminProcedure.mutation(...),
  update: adminProcedure.mutation(...),
  delete: adminProcedure.mutation(...),
});
```

Protected package endpoints:

```ts
packages: router({
  create: adminProcedure.mutation(...),
  update: adminProcedure.mutation(...),
  delete: adminProcedure.mutation(...),
});
```

This prevents access through:

- Hidden UI bypasses
- Manually typed admin URLs
- Browser dev tools
- Postman/API calls
- Direct tRPC mutation calls

## Which Email Should You Register With?

Register with an email address you personally control and will continue using for admin access.
Use the same email in the SQL update.

Example:

```sql
UPDATE "users"
SET "role" = 'admin'
WHERE "email" = 'your-real-email@gmail.com';
```

Do not use `myemail@example.com`; it is only a placeholder.

## Security Test Checklist

1. Visit the site as a guest.
   - Admin button should not appear.
   - `/admin` should redirect to `/`.

2. Log in as a normal user.
   - Admin button should not appear.
   - `/admin`, `/admin/matches`, and `/admin/packages` should redirect to `/`.
   - Admin API mutations should return `403 Forbidden`.

3. Promote your real account:

```sql
UPDATE "users"
SET "role" = 'admin'
WHERE "email" = 'your-email@example.com';
```

4. Log out and log back in.
   - Admin button should appear.
   - Admin pages should load.
   - Match/package create, edit, and delete should work.

