import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

// Mock user contexts
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: 'admin-user',
      email: 'admin@example.com',
      name: 'Admin User',
      loginMethod: 'manus',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

describe('Matches API', () => {
  it('should list all matches publicly', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const matches = await caller.matches.list();
    expect(Array.isArray(matches)).toBe(true);
  });

  it('should get a match by ID publicly', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First get all matches to find one
    const matches = await caller.matches.list();
    if (matches.length > 0) {
      const match = await caller.matches.getById({ id: matches[0].id });
      expect(match).toBeDefined();
      expect(match?.id).toBe(matches[0].id);
    }
  });

  it('should filter matches by stage publicly', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const groupMatches = await caller.matches.getByStage({ stage: 'group' });
    expect(Array.isArray(groupMatches)).toBe(true);
    groupMatches.forEach((match) => {
      expect(match.stage).toBe('group');
    });
  });

  it('should deny match creation to non-admin users', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.matches.create({
        matchNumber: 999,
        team1: 'Test Team 1',
        team1Code: 'TT1',
        team2: 'Test Team 2',
        team2Code: 'TT2',
        stadium: 'Test Stadium',
        city: 'Test City',
        country: 'Test Country',
        matchDate: new Date(),
        stage: 'group',
      });
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.code).toBe('UNAUTHORIZED');
    }
  });

  it('should allow match creation to admin users', async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.matches.create({
      matchNumber: 999,
      team1: 'Test Team 1',
      team1Code: 'TT1',
      team2: 'Test Team 2',
      team2Code: 'TT2',
      stadium: 'Test Stadium',
      city: 'Test City',
      country: 'Test Country',
      matchDate: new Date(),
      stage: 'group',
    });

    expect(result).toBeDefined();
  });
});

describe('Packages API', () => {
  it('should list all packages publicly', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const packages = await caller.packages.list();
    expect(Array.isArray(packages)).toBe(true);
  });

  it('should get packages by match ID publicly', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Get a match first
    const matches = await caller.matches.list();
    if (matches.length > 0) {
      const packages = await caller.packages.getByMatchId({ matchId: matches[0].id });
      expect(Array.isArray(packages)).toBe(true);
    }
  });

  it('should deny package creation to non-admin users', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.packages.create({
        matchId: 1,
        category: 'Category 1',
        price: 100,
        quantity: 100,
      });
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.code).toBe('UNAUTHORIZED');
    }
  });
});

describe('Inquiries API', () => {
  it('should allow public users to create inquiries', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiries.create({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      message: 'I am interested in tickets',
    });

    expect(result).toBeDefined();
  });

  it('should deny inquiry listing to non-admin users', async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inquiries.list();
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.code).toBe('UNAUTHORIZED');
    }
  });

  it('should allow admin users to list inquiries', async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const inquiries = await caller.inquiries.list();
    expect(Array.isArray(inquiries)).toBe(true);
  });

  it('should allow admin users to update inquiry status', async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First create an inquiry
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);
    await publicCaller.inquiries.create({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      message: 'I am interested in tickets',
    });

    // Then list and update
    const inquiries = await caller.inquiries.list();
    if (inquiries.length > 0) {
      const result = await caller.inquiries.updateStatus({
        id: inquiries[0].id,
        status: 'contacted',
      });
      expect(result).toBeDefined();
    }
  });
});
