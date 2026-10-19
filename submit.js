const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "POST method required." });
  }

  const data = req.body;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return res.status(400).json({ ok: false, message: "Form data is missing." });
  }

  // Hidden honeypot field; ignore automated submissions that fill it.
  if (String(data.website || "").trim()) {
    return res.status(200).json({ ok: true });
  }

  const salonName = String(data["Salon ka naam"] || "").trim().slice(0, 150);
  if (!salonName) {
    return res.status(400).json({ ok: false, message: "Salon ka naam bharna zaroori hai." });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!gmailUser || !gmailAppPassword || !ownerEmail) {
    console.error("Missing email environment variables.");
    return res.status(500).json({ ok: false, message: "Email setup complete nahi hai." });
  }

  const answers = Object.entries(data)
    .filter(([question]) => question !== "website")
    .map(([question, rawAnswer]) => {
      const answer = Array.isArray(rawAnswer) ? rawAnswer.join(", ") : String(rawAnswer || "");
      return `${cleanText(question, 250)}:\n${cleanText(answer, 5000) || "—"}`;
    });

  const contactEmail = String(data["Business email"] || "").trim();
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ? contactEmail : undefined;
  const subjectName = salonName.replace(/[\r\n]+/g, " ").slice(0, 100);
  const text = [
    "Naya salon website requirement form submit hua.",
    `Salon: ${salonName}`,
    "",
    ...answers
  ].join("\n\n");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailAppPassword }
    });

    await transporter.sendMail({
      from: `Salon Website Form <${gmailUser}>`,
      to: ownerEmail,
      replyTo,
      subject: `Salon website form — ${subjectName}`,
      text
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Could not send salon form email.", error && error.message);
    return res.status(500).json({ ok: false, message: "Email nahi bheja ja saka. Dobara koshish karein." });
  }
};

function cleanText(value, maxLength) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .slice(0, maxLength);
}
