"use server";

import { headers } from "next/headers";
import { limits, topics, topicSubjects, type ContactField, type ContactState, type Topic } from "@/data/contact";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  const body = new URLSearchParams({ secret, response: token, ...(ip && { remoteip: ip }) });
  // Panne réseau ou réponse illisible : on refuse proprement au lieu de faire planter l'action
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[contact] Turnstile injoignable", error);
    return false;
  }
}

async function sendEmail(subject: string, text: string, replyTo: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  // En local sans clé Resend, on affiche le message dans le terminal au lieu de l'envoyer
  if (!apiKey || !to) {
    if (process.env.NODE_ENV === "production") return false;
    console.info(`[contact] ${subject}\nReply-To: ${replyTo}\n\n${text}`);
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: replyTo,
        subject,
        text,
      }),
    });
    if (!res.ok) console.error("[contact] Resend a refusé l'envoi", res.status, await res.text());
    return res.ok;
  } catch (error) {
    console.error("[contact] Resend injoignable", error);
    return false;
  }
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();
  const name = get("name").replace(/\s+/g, " ");
  const email = get("email");
  const topic = get("topic") as Topic;
  const message = get("message");

  // Champ invisible : seul un robot le remplit, on fait comme si tout s'était bien passé
  if (get("website")) return { status: "success" };

  const values = { name, email, topic, message };
  const fields: ContactField[] = [];
  if (!name || name.length > limits.name) fields.push("name");
  if (!emailPattern.test(email) || email.length > limits.email) fields.push("email");
  if (!topics.includes(topic)) fields.push("topic");
  if (message.length < limits.messageMin || message.length > limits.message) fields.push("message");
  if (fields.length) return { status: "error", error: "invalid", fields, values };

  if (!(await verifyTurnstile(get("cf-turnstile-response")))) return { status: "error", error: "captcha", values };

  // Texte brut uniquement : rien de ce que tape le visiteur n'est interprété comme du HTML
  const sent = await sendEmail(
    `[Portfolio] ${topicSubjects[topic]} : ${name}`,
    `Nom : ${name}\nEmail : ${email}\nSujet : ${topicSubjects[topic]}\n\n${message}`,
    email,
  );
  return sent ? { status: "success" } : { status: "error", error: "send", values };
}
