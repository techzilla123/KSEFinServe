import type { Config, Context } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;
const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI!;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ADMIN_EMAIL = "admin@ksefinserve.com";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return new Response(`Zoom OAuth error: ${error}`, { status: 400 });
  }

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  try {
    const tokenRes = await fetch(
      `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(ZOOM_REDIRECT_URI)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const tokens = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("Token exchange failed:", tokens);
      return new Response("Failed to exchange code for tokens", { status: 500 });
    }

    // Store tokens in Supabase
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    const { error: upsertError } = await supabase
      .from("zoom_tokens")
      .upsert(
        {
          user_id: ADMIN_EMAIL,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      console.error("Failed to store Zoom tokens:", upsertError);
      return new Response("Failed to store tokens", { status: 500 });
    }

    // Redirect to success page (no tokens in URL)
    const frontendUrl = process.env.URL || "http://localhost:8443";
    const redirectUrl = `${frontendUrl}/zoom-success?connected=true`;

    return Response.redirect(redirectUrl, 302);
  } catch (err) {
    console.error("Zoom callback error:", err);
    return new Response("Internal server error", { status: 500 });
  }
};

export const config: Config = {
  path: "/.netlify/functions/zoom-callback",
};