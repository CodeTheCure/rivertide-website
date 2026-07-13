import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, role } = body;

    // ── Validation ────────────────────────────────────────────────
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
      return Response.json({ success: false, errors }, { status: 400 });
    }

    // ── Insert into Supabase ──────────────────────────────────────
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      return Response.json(
        { success: false, errors: ["Service temporarily unavailable."] },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error: insertError } = await supabase
      .from("waitlist")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        source: "website",
      })
      .select("id, name, email, role, created_at")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return Response.json(
          { success: false, errors: ["This email is already on the waitlist."] },
          { status: 409 }
        );
      }
      console.error("Supabase insert error:", insertError);
      return Response.json(
        { success: false, errors: ["Something went wrong. Please try again."] },
        { status: 500 }
      );
    }

    return Response.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json(
      { success: false, errors: ["Internal server error."] },
      { status: 500 }
    );
  }
}
