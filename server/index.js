/**
 * Rivertide API Server
 *
 * Powered by @supabase/server — handles auth, client creation,
 * and context injection so each route just writes business logic.
 *
 * Environment variables (required):
 *   SUPABASE_URL
 *   SUPABASE_PUBLISHABLE_KEY
 *   SUPABASE_SECRET_KEY
 *   SUPABASE_JWKS_URL (used to verify user JWTs)
 */

// Load .env (only in development — in production these are set by the host)
require("dotenv").config();

const { serve } = require("@hono/node-server");
const { Hono } = require("hono");
const { cors } = require("hono/cors");
const { createSupabaseContext } = require("@supabase/server");

const app = new Hono();

// ── CORS ----------------------------------------------------------------
app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "https://codethecure.github.io", "https://rivertide.app"],
    credentials: true,
  }),
);

// ── Health check ---------------------------------------------------------
app.get("/api/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);

// ── POST /api/waitlist --------------------------------------------------
// Validation runs BEFORE Supabase context creation, so missing
// environment variables never mask user-facing validation errors.
//
// Uses "secret" auth mode (service_role key) so we bypass RLS.
// In production, add rate-limiting and CSRF protection.
app.post("/api/waitlist", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, role } = body;

    // ── Validation (no Supabase needed) ─────────────────────────────
    const errors = [];
    if (!name || typeof name !== "string" || name.trim().length === 0)
      errors.push("Name is required.");
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    )
      errors.push("A valid email address is required.");
    if (!role || typeof role !== "string")
      errors.push("Role selection is required.");

    if (errors.length > 0) {
      return c.json({ success: false, errors }, 400);
    }

    // ── Create Supabase context (may fail if env vars not set) ─────
    const { data: ctx, error: ctxError } = await createSupabaseContext(
      c.req.raw,
      { auth: "secret" },
    );

    if (ctxError) {
      console.error("Supabase context error:", ctxError);
      return c.json(
        { success: false, errors: ["Service temporarily unavailable."] },
        503,
      );
    }

    // ── Insert into Supabase ────────────────────────────────────────
    const { data, error } = await ctx.supabaseAdmin
      .from("waitlist")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        source: "website",
      })
      .select("id, name, email, role, created_at")
      .single();

    if (error) {
      // Handle duplicate email gracefully
      if (error.code === "23505") {
        return c.json(
          {
            success: false,
            errors: ["This email is already on the waitlist."],
          },
          409,
        );
      }
      console.error("Supabase insert error:", error);
      return c.json(
        { success: false, errors: ["Something went wrong. Please try again."] },
        500,
      );
    }

    return c.json({ success: true, data }, 201);
  } catch (err) {
    console.error("Unexpected error:", err);
    return c.json({ success: false, errors: ["Internal server error."] }, 500);
  }
});

// ── Start server ---------------------------------------------------------
const port = parseInt(process.env.PORT, 10) || 3001;

console.log("");
console.log("  ╔══════════════════════════════════════════╗");
console.log("  ║         Rivertide API Server             ║");
console.log("  ╠══════════════════════════════════════════╣");
console.log(`  ║  http://localhost:${port}/api/health        ║`);
console.log(`  ║  http://localhost:${port}/api/waitlist     ║`);
console.log("  ╚══════════════════════════════════════════╝");
console.log("");

serve({ fetch: app.fetch, port });
