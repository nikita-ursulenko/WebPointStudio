
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
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
            // Email 1: Admin Notification
            const adminSubject = `[WebPoint] Новая заявка: ${payload.project_type || 'Общая'}`;
            const adminHtml = `
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

            // Email 2: Client Auto-Reply
            const clientSubject = `Спасибо за обращение в WebPoint!`;
            const clientHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">✅ Ваша заявка принята!</h2>
          <p>Здравствуйте, <strong>${payload.name}</strong>!</p>
          <p>Мы получили вашу заявку и свяжемся с вами в ближайшее время.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Детали вашей заявки:</strong></p>
          <p><strong>Тип проекта:</strong> ${payload.project_type}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          <p><strong>Телефон:</strong> ${payload.phone}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666;">
            С уважением,<br>
            Команда <strong>WebPoint</strong>
          </p>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            Это автоматическое сообщение. Пожалуйста, не отвечайте на него.
          </p>
        </div>
      `;

            console.log('=== DUAL EMAIL NOTIFICATION START ===');
            console.log(`Admin email target: developmentwebpoint@gmail.com`);
            console.log(`Client email target: ${payload.email}`);
            console.log(`Project type: ${payload.project_type}`);
            console.log(`Client name: ${payload.name}`);

            // Send admin notification
            console.log('\n[ADMIN EMAIL] Preparing to send...');
            const adminRes = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: "WebPoint Bot <onboarding@resend.dev>",
                    to: ["developmentwebpoint@gmail.com"],
                    subject: adminSubject,
                    html: adminHtml,
                }),
            });

            const adminData = await adminRes.json();
            console.log(`[ADMIN EMAIL] Response status: ${adminRes.status}`);
            console.log(`[ADMIN EMAIL] Response data:`, JSON.stringify(adminData, null, 2));

            if (!adminRes.ok) {
                console.error(`[ADMIN EMAIL] ❌ FAILED: ${adminData.message || 'Unknown error'}`);
                throw new Error(`Failed to send admin email: ${adminData.message || 'Unknown error'}`);
            }
            console.log('[ADMIN EMAIL] ✅ SUCCESS');

            // Send client auto-reply
            console.log('\n[CLIENT EMAIL] Preparing to send...');
            const clientRes = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: "WebPoint <onboarding@resend.dev>",
                    to: [payload.email],
                    subject: clientSubject,
                    html: clientHtml,
                }),
            });

            const clientData = await clientRes.json();
            console.log(`[CLIENT EMAIL] Response status: ${clientRes.status}`);
            console.log(`[CLIENT EMAIL] Response data:`, JSON.stringify(clientData, null, 2));

            if (!clientRes.ok) {
                console.error(`[CLIENT EMAIL] ❌ FAILED: ${clientData.message || 'Unknown error'}`);
                console.error('[CLIENT EMAIL] Note: Admin email was sent successfully');
                // Don't throw - admin email already sent successfully
            } else {
                console.log('[CLIENT EMAIL] ✅ SUCCESS');
            }

            console.log('=== DUAL EMAIL NOTIFICATION END ===\n');

            return new Response(JSON.stringify({
                admin: adminData,
                client: clientData,
                success: true
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });

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

            console.log(`Sending email to developmentwebpoint@gmail.com for type: ${type}`);

            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: "WebPoint Bot <onboarding@resend.dev>",
                    to: ["developmentwebpoint@gmail.com"],
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
        } else {
            throw new Error("Unknown notification type");
        }

    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
