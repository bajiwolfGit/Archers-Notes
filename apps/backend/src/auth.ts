import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import { createAuthMiddleware, APIError } from "better-auth/api";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not configured");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
  },

  // This is the stuff that only dlsu emails are allowed
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      const email = ctx.body?.email;

      if (
        typeof email !== "string" ||
        !email.trim().toLowerCase().endsWith("@dlsu.edu.ph")
      ) {
        throw new APIError("BAD_REQUEST", {
          message: "Only DLSU email addresses are allowed.",
        });
      }
    }),
  },

  user: {
    modelName: "users",

    fields: {
      email: "gmail",
      image: "image",
      createdAt: "created_at",
      updatedAt: "updatedAt",
    },

    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },

  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});