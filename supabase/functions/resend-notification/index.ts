
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
        <div style="font-family: sans-serif; background-color: #0d0d12; color: #ffffff; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #00d2ff 0%, #9b4dff 100%); margin: 0; color: #ffffff;">WebPoint</h1>
          </div>
          
          <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #ffffff;">🚀 Новая заявка!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.7); margin: 0 0 16px 0;">На сайте оставлена новая заявка на разработку. Детали ниже:</p>

          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <span style="font-size: 12px; font-weight: 700; color: #9b4dff; text-transform: uppercase; margin-bottom: 4px; display: block;">Клиент</span>
            <div style="font-size: 18px; font-weight: 500; color: #ffffff; margin-bottom: 12px;">${payload.name}</div>

            <span style="font-size: 12px; font-weight: 700; color: #9b4dff; text-transform: uppercase; margin-bottom: 4px; display: block;">Email</span>
            <div style="font-size: 18px; font-weight: 500; color: #ffffff; margin-bottom: 12px;"><a href="mailto:${payload.email}" style="color: #ffffff; text-decoration: none;">${payload.email}</a></div>

            <span style="font-size: 12px; font-weight: 700; color: #9b4dff; text-transform: uppercase; margin-bottom: 4px; display: block;">Телефон</span>
            <div style="font-size: 18px; font-weight: 500; color: #ffffff; margin-bottom: 12px;">${payload.phone}</div>

            <span style="font-size: 12px; font-weight: 700; color: #9b4dff; text-transform: uppercase; margin-bottom: 4px; display: block;">Тип проекта</span>
            <div style="font-size: 18px; font-weight: 500; color: #00d2ff; margin-bottom: 0;">${payload.project_type || 'Общая'}</div>
          </div>

          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <span style="font-size: 12px; font-weight: 700; color: #00d2ff; text-transform: uppercase; margin-bottom: 12px; display: block;">Сообщение от клиента</span>
            <div style="background: rgba(0, 210, 255, 0.05); border-left: 3px solid #00d2ff; padding: 16px; border-radius: 4px; font-style: italic; color: rgba(255, 255, 255, 0.8);">
              ${payload.message?.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="text-align: center; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; color: rgba(255, 255, 255, 0.4);">
            Отправлено автоматически с сайта webpoint.md<br>
            &copy; 2026 WebPoint Visionary Sites
          </div>
        </div>
      `;

            // Email 2: Client Auto-Reply
            const clientSubject = `Спасибо за обращение в WebPoint!`;
            const clientHtml = `
        <div style="font-family: sans-serif; background-color: #0d0d12; color: #ffffff; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #00d2ff 0%, #9b4dff 100%); margin: 0; color: #ffffff;">WebPoint</h1>
          </div>
          
          <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #ffffff;">Ваша заявка принята! ✅</h2>
          <p style="font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.7); margin: 0 0 16px 0;">Здравствуйте, <strong>${payload.name}</strong>!</p>
          <p style="font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.7); margin: 0 0 24px 0;">Благодарим вас за обращение в <strong>WebPoint</strong>. Мы получили ваш запрос и наша команда уже начала его изучать.</p>
          
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">Что дальше?</p>
            <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin: 0;">Мы свяжемся с вами в течение 24 часов для обсуждения деталей и назначения консультации.</p>
          </div>

          <div style="margin-bottom: 32px; padding: 0 24px;">
            <p style="font-size: 14px; color: rgba(255, 255, 255, 0.4); margin: 0 0 8px 0;">Детали вашей заявки:</p>
            <div style="font-size: 14px; color: #ffffff; line-height: 1.5;">
              <strong>Тип:</strong> ${payload.project_type}<br>
              <strong>Телефон:</strong> ${payload.phone}
            </div>
          </div>

          <center>
            <a href="https://webpoint.md" style="display: inline-block; background: linear-gradient(135deg, #00d2ff 0%, #9b4dff 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">Перейти на сайт</a>
          </center>

          <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; color: rgba(255, 255, 255, 0.4);">
            С уважением, команда WebPoint<br>
            <span style="font-size: 10px; opacity: 0.5;">Это автоматическое уведомление, на него не нужно отвечать.</span>
          </div>
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
