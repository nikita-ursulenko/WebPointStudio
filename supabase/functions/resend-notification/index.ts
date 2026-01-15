
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { type, payload } = await req.json();

        if (!RESEND_API_KEY) {
            console.error("Missing RESEND_API_KEY");
            throw new Error("Server configuration error: Missing API Key");
        }

        let startHtml = "";
        let subject = "";

        if (type === 'contact') {
            subject = `[WebPoint] Новая заявка: ${payload.project_type || 'Общая'}`;
            startHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🚀 Новая заявка с сайта</h2>
          <p><strong>Имя:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
          <p><strong>Телефон:</strong> ${payload.phone}</p>
          <p><strong>Тип проекта:</strong> ${payload.project_type}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Сообщение:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
            ${payload.message?.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            Отправлено автоматически с сайта webpoint.md
          </p>
        </div>
      `;
        } else if (type === 'newsletter') {
            subject = `[WebPoint] Новый подписчик`;
            startHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">📬 Новый подписчик на новости</h2>
          <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            Отправлено автоматически с сайта webpoint.md
          </p>
        </div>
      `;
        } else {
            throw new Error("Unknown notification type");
        }

        console.log(`Sending email to nik.urs@icloud.com for type: ${type}`);

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "WebPoint Bot <onboarding@resend.dev>",
                to: ["nik.urs@icloud.com"],
                subject: subject,
                html: startHtml,
            }),
        });

        const data = await res.json();
        console.log("Resend response:", data);

        if (!res.ok) {
            throw new Error(data.message || "Failed to send email");
        }

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error: any) {
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
