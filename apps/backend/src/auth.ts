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

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
throw new Error("Google OAuth credentials are not configured");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });


/**
 * Generate a username from the user's name.
 *
 * Examples:
 * "Alex Santos"        -> "alexsantos"
 * "Maria Clara Cruz"   -> "mariaclaracruz"
 * "Alex Santos" taken  -> "alexsantosabc123"
 */
async function generateUniqueUsername(name: string): Promise<string> {
  const base =
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 40);

  // If the name has no English letters or numbers,
  // use "user" as the base instead.
  const usernameBase = base || "user";

  const existing = await prisma.users.findUnique({
    where: { username: usernameBase },
    select: { id: true },
  });

  if (!existing) {
    return usernameBase;
  }

  for (let attempt = 0; attempt < 10; attempt++) {
    const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6);
    const username = `${usernameBase.slice(0, 43)}${suffix}`.slice(0, 50);

    const duplicate = await prisma.users.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!duplicate) {
      return username;
    }
  }

  throw new Error("Could not generate a unique username.");
}



export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  // Frontend 
  trustedOrigins: ["http://localhost:3000"],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
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

  // Generate a username before inserting a new user into the database.
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          console.log("User data before creation:", user);

          const username = await generateUniqueUsername(user.name);

          return {
            data: {
              ...user,
              username,
            },
          };
        },
      },
    },
  },


  user: {
    modelName: "users",

    fields: {
      email: "gmail",
      image: "image",
      createdAt: "created_at",
      updatedAt: "updatedAt",
    },

    /* 
    required - Better Auth doesn't require the username in its normal input validation.
    input - Users cannot provide the username directly through Better Auth's normal input fields. Your server should generate it.
    I put them both to false
    */
    additionalFields: {
      username: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },

  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});