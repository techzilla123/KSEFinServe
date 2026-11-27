import type { Config, Context } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const ZOOM_API_BASE = "https://api.zoom.us/v2";
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ADMIN_EMAIL = "admin@ksefinserve.com";

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string; expires_in: number } | null> {
  try {
    const res = await fetch(
      `https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const tokens = await res.json();

    if (!res.ok) {
      console.error("Token refresh failed:", tokens);
      return null;
    }

    // Store refreshed tokens
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    await supabase
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

    return tokens;
  } catch (err) {
    console.error("Token refresh error:", err);
    return null;
  }
}

async function getValidAccessToken(): Promise<string | null> {
  const { data, error } = await supabase
    .from("zoom_tokens")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", ADMIN_EMAIL)
    .single();

  if (error || !data) {
    console.error("No Zoom tokens found:", error);
    return null;
  }

  // Check if token is still valid (with 5 min buffer)
  if (Date.now() < data.expires_at - 5 * 60 * 1000) {
    return data.access_token;
  }

  // Token expired, try to refresh
  console.log("Access token expired, refreshing...");
  const refreshed = await refreshAccessToken(data.refresh_token);
  return refreshed?.access_token ?? null;
}

async function createZoomMeeting(accessToken: string, meetingDetails: {
  topic: string;
  start_time: string;
  duration: number;
  timezone: string;
  agenda?: string;
}): Promise<{ join_url: string; meeting_id: string; start_url: string } | null> {
  try {
    const res = await fetch(`${ZOOM_API_BASE}/users/me/meetings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: meetingDetails.topic,
        type: 2,
        start_time: meetingDetails.start_time,
        duration: meetingDetails.duration,
        timezone: meetingDetails.timezone,
        agenda: meetingDetails.agenda,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          use_pmi: false,
          approval_type: 0,
          audio: "both",
          auto_recording: "none",
        },
      }),
    });

    const meeting = await res.json();

    if (!res.ok) {
      console.error("Zoom meeting creation failed:", meeting);
      return null;
    }

    return {
      join_url: meeting.join_url,
      meeting_id: String(meeting.id),
      start_url: meeting.start_url,
    };
  } catch (err) {
    console.error("Zoom API error:", err);
    return null;
  }
}

export default async (req: Request, context: Context) => {
  const body = await req.json();

  const {
    reference,
    userName,
    userEmail,
    bookingDate,
    bookingTime,
    topic,
    path,
    duration = 60,
  } = body;

  if (!reference || !userName || !bookingDate || !bookingTime) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Get valid access token from Supabase (auto-refreshes if expired)
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    return new Response(
      JSON.stringify({ error: "No valid Zoom access token. Please connect Zoom in admin settings." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const utcDateTime = new Date(bookingTime);
  if (isNaN(utcDateTime.getTime())) {
    return new Response(
      JSON.stringify({ error: "Invalid booking time" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const startTime = utcDateTime.toISOString();

  const meetingTopic = `KSEFinServe Session - ${userName} (${reference})`;
  const agenda = `Session Path: ${path || 'Wealth planning'}\nTopic: ${topic || 'General'}\nClient: ${userName} (${userEmail})\nReference: ${reference}`;

  const meeting = await createZoomMeeting(accessToken, {
    topic: meetingTopic,
    start_time: startTime,
    duration,
    timezone: "America/Chicago",
    agenda,
  });

  if (!meeting) {
    return new Response(
      JSON.stringify({ error: "Failed to create Zoom meeting. Token may be invalid." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, ...meeting }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const config: Config = {
  path: "/.netlify/functions/create-zoom-meeting",
};