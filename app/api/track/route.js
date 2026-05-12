import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    const { error } = await supabase.from("showroom_events").insert([
      {
        event_type: body.event_type,
        vehicle_id: body.vehicle_id || null,
        vehicle_slug: body.vehicle_slug || null,
        vehicle_title: body.vehicle_title || null,
        metadata: body.metadata || {},
      },
    ]);

    if (error) {
      console.error("TRACK ERROR:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("TRACK ROUTE ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Tracking failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Use POST" },
    { status: 405 }
  );
}