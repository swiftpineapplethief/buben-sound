// Vercel Serverless Function — api/booking.js
// Uses Resend (resend.com) free tier to send booking request emails to you.
//
// Setup:
//  1. Sign up at resend.com (free — 3,000 emails/month)
//  2. Get your API key from the Resend dashboard
//  3. In Vercel dashboard → your project → Settings → Environment Variables
//     Add: RESEND_API_KEY = re_xxxxxxxxxxxx
//     Add: NOTIFY_EMAIL   = hello@bubensound.com  (where YOU receive requests)
//     Add: FROM_EMAIL     = bookings@yourdomain.com (must be verified in Resend)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, startDate, endDate, eventType, notes } = req.body;

  if (!name || !email || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const notifyEmail = process.env.NOTIFY_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || "bookings@bubensound.com";
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  const html = `
    <div style="font-family: monospace; max-width: 600px; background: #0d0d0d; color: #f0f0f0; padding: 2rem; border: 1px solid #222;">
      <h2 style="color: #fff; letter-spacing: 0.1em; border-bottom: 1px solid #333; padding-bottom: 1rem;">
        NEW BOOKING REQUEST — BUBEN SOUND
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
        <tr><td style="color:#888; padding: 8px 0; width:140px;">Name</td><td style="color:#f0f0f0;">${name}</td></tr>
        <tr><td style="color:#888; padding: 8px 0;">Email</td><td style="color:#f0f0f0;"><a href="mailto:${email}" style="color:#f0f0f0;">${email}</a></td></tr>
        <tr><td style="color:#888; padding: 8px 0;">Phone</td><td style="color:#f0f0f0;">${phone || "—"}</td></tr>
        <tr><td style="color:#888; padding: 8px 0;">Event Type</td><td style="color:#f0f0f0;">${eventType || "—"}</td></tr>
        <tr><td style="color:#888; padding: 8px 0;">Start Date</td><td style="color:#f0f0f0;">${startDate}</td></tr>
        <tr><td style="color:#888; padding: 8px 0;">End Date</td><td style="color:#f0f0f0;">${endDate}</td></tr>
        <tr><td style="color:#888; padding: 8px 0; vertical-align:top;">Notes</td><td style="color:#f0f0f0;">${notes || "—"}</td></tr>
      </table>
      <p style="margin-top:2rem; color:#555; font-size:0.8rem;">
        Reply directly to this email to respond to ${name}.
      </p>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notifyEmail],
        reply_to: email,
        subject: `Booking Request — ${name} | ${startDate} to ${endDate}`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Resend error:", err);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
