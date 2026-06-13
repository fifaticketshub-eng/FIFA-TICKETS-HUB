import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  
  ai: router({
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["system", "user", "assistant"]),
          content: z.string(),
        })),
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: input.messages as any,
          });
          
          const content = response.choices[0].message.content;
          return typeof content === "string" 
            ? content 
            : Array.isArray(content) 
              ? content.map(c => ("text" in c ? c.text : "")).join("")
              : "";
        } catch (error) {
          console.error("[AI Router Error]", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate AI response",
          });
        }
      }),
  }),

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    localAccess: publicProcedure
      .input(z.object({
        mode: z.enum(["login", "signup"]),
        name: z.string().trim().min(1).max(200).optional(),
        email: z.string().trim().email().max(320),
      }))
      .mutation(async ({ ctx, input }) => {
        const email = input.email.toLowerCase();
        const openId = `local:${email}`;
        const name = input.name?.trim() || email.split("@")[0];
        const existingUser = await db.getUserByOpenId(openId);

        if (input.mode === "login" && !existingUser) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No account found for this email. Please sign up first.",
          });
        }

        if (input.mode === "signup" && existingUser) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "An account already exists for this email. Please login.",
          });
        }

        const savedUser = await db.upsertUser({
          openId,
          name,
          email,
          loginMethod: input.mode,
          lastSignedIn: new Date(),
        });

        if (!savedUser) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Account could not be saved. Check that PostgreSQL is running and the users table exists.",
          });
        }

        if (input.mode === "signup") {
          return {
            user: null,
            created: true,
          } as const;
        }

        const sessionToken = await sdk.createSessionToken(openId, {
          name,
          expiresInMs: ONE_YEAR_MS,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        return {
          user: savedUser,
          created: false,
        } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, cookieOptions);
      return {
        success: true,
      } as const;
    }),
  }),

  // Matches routes
  matches: router({
    list: publicProcedure.query(async () => {
      return db.getAllMatches();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getMatchById(input.id);
      }),

    getByStage: publicProcedure
      .input(z.object({ stage: z.string() }))
      .query(async ({ input }) => {
        return db.getMatchesByStage(input.stage);
      }),

    getByGroup: publicProcedure
      .input(z.object({ group: z.string() }))
      .query(async ({ input }) => {
        return db.getMatchesByGroup(input.group);
      }),

    create: adminProcedure
      .input(z.object({
        matchNumber: z.number(),
        team1: z.string(),
        team1Code: z.string(),
        team2: z.string(),
        team2Code: z.string(),
        stadium: z.string(),
        city: z.string(),
        country: z.string(),
        matchDate: z.date(),
        stage: z.enum(['group', 'round_of_16', 'quarter_final', 'semi_final', 'final']),
        group: z.string().optional(),
        availability: z.enum(['available', 'limited', 'sold_out']).optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createMatch(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          matchNumber: z.number().optional(),
          team1: z.string().optional(),
          team1Code: z.string().optional(),
          team2: z.string().optional(),
          team2Code: z.string().optional(),
          stadium: z.string().optional(),
          city: z.string().optional(),
          country: z.string().optional(),
          matchDate: z.date().optional(),
          stage: z.enum(['group', 'round_of_16', 'quarter_final', 'semi_final', 'final']).optional(),
          group: z.string().optional(),
          availability: z.enum(['available', 'limited', 'sold_out']).optional(),
          imageUrl: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updateMatch(input.id, input.data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteMatch(input.id);
      }),
  }),

  // Ticket packages routes
  packages: router({
    list: publicProcedure.query(async () => {
      return db.getAllPackages();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getPackageById(input.id);
      }),

    getByMatchId: publicProcedure
      .input(z.object({ matchId: z.number() }))
      .query(async ({ input }) => {
        return db.getPackagesByMatchId(input.matchId);
      }),

    create: adminProcedure
      .input(z.object({
        matchId: z.number(),
        category: z.enum(['Category 1', 'Category 2', 'Category 3', 'Category 4']),
        description: z.string().optional(),
        price: z.number(),
        currency: z.string().optional(),
        quantity: z.number(),
        benefits: z.string().optional(),
        seatType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createPackage(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          category: z.enum(['Category 1', 'Category 2', 'Category 3', 'Category 4']).optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          currency: z.string().optional(),
          quantity: z.number().optional(),
          quantitySold: z.number().optional(),
          benefits: z.string().optional(),
          seatType: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        return db.updatePackage(input.id, input.data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deletePackage(input.id);
      }),
  }),

  // Customer inquiries routes
  inquiries: router({
    list: adminProcedure.query(async () => {
      return db.getAllInquiries();
    }),

    getByStatus: adminProcedure
      .input(z.object({ status: z.string() }))
      .query(async ({ input }) => {
        return db.getInquiriesByStatus(input.status);
      }),

    create: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        matchId: z.number().optional(),
        ticketCategoryId: z.number().optional(),
        message: z.string(),
      }))
      .mutation(async ({ input }) => {
        return db.createInquiry(input);
      }),

    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['new', 'contacted', 'resolved']),
      }))
      .mutation(async ({ input }) => {
        return db.updateInquiry(input.id, { status: input.status });
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteInquiry(input.id);
      }),
  }),

});

export type AppRouter = typeof appRouter;
