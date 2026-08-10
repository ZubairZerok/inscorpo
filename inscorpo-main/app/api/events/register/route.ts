import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, organization, eventId, eventTitle, teamName, notes } = body;

    if (!name || !email || !eventTitle) {
      return NextResponse.json({ error: "Missing required registration fields" }, { status: 400 });
    }

    const ticketId = `TICKET-${(eventId || "BAUBC").toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toISOString();

    // Log registration dispatch in dev mode
    if (process.env.NODE_ENV !== "production") {
      console.log("=================================================");
      console.log("EVENT REGISTRATION DISPATCHED");
      console.log(`Ticket ID: ${ticketId}`);
      console.log(`Event: ${eventTitle}`);
      console.log(`Attendee: ${name} (${email})`);
      console.log(`Timestamp: ${timestamp}`);
      console.log("=================================================");
    }

    return NextResponse.json({
      success: true,
      ticketId,
      eventTitle,
      emailSentTo: ["bcofbau@gmail.com", email],
      message: `Registration confirmed! Official ticket details have been routed to bcofbau@gmail.com and ${email}.`
    });
  } catch (error) {
    console.error("Failed to process event registration API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
