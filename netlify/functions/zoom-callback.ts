import type { Config, Context } from "@netlify/functions";

const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;
const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI!;

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

    // Redirect to success page with tokens in fragment for localStorage storage
    const frontendUrl = process.env.URL || "http://localhost:8443";
    const redirectUrl = `${frontendUrl}/zoom-success#access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}&expires_in=${tokens.expires_in}`;

    return Response.redirect(redirectUrl, 302);
  } catch (err) {
    console.error("Zoom callback error:", err);
    return new Response("Internal server error", { status: 500 });
  }
};

export const config: Config = {
  path: "/.netlify/functions/zoom-callback",
};