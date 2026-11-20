import type { Config, Context } from "@netlify/functions";

const ZOOM_API_BASE = "https://api.zoom.us/v2";

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
    accessToken,
  } = body;

  if (!reference || !userName || !bookingDate || !bookingTime) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!accessToken) {
    return new Response(
      JSON.stringify({ error: "No Zoom access token provided. Please connect Zoom first." }),
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
      JSON.stringify({ error: "Failed to create Zoom meeting. Token may be expired." }),
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