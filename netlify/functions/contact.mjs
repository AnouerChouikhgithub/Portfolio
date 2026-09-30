const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { from_name, from_email, phone, message, website } = body;

  // Honeypot: bots fill this, humans never see it
  if (website) return json({ ok: true });

  const name = String(from_name ?? "").trim();
  const email = String(from_email ?? "").trim();
  const msg = String(message ?? "").trim();

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !msg) {
    return json({ error: "Invalid fields" }, 400);
  }
  if (msg.length > 5000) return json({ error: "Message too long" }, 400);

  const {
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
    EMAILJS_PRIVATE_KEY,
  } = process.env;

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.error("Missing EmailJS environment variables");
    return json({ error: "Server misconfigured" }, 500);
  }

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: {
        from_name: name,
        from_email: email,
        phone: String(phone ?? "").trim() || "N/A",
        message: msg,
      },
    }),
  });

  if (!res.ok) {
    console.error("EmailJS error:", res.status, await res.text());
    return json({ error: "Email provider error" }, 502);
  }

  return json({ ok: true });
};

export const config = { path: "/api/contact" };
