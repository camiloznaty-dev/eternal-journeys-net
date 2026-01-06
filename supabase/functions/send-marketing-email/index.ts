import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MarketingEmailRequest {
  to: string[];
  subject: string;
  html: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html }: MarketingEmailRequest = await req.json();

    if (!to || !to.length) {
      throw new Error("No recipients provided");
    }

    if (!subject) {
      throw new Error("Subject is required");
    }

    if (!html) {
      throw new Error("HTML content is required");
    }

    console.log(`Sending marketing email to ${to.length} recipients`);

    // Send emails in batches of 50 to avoid rate limits
    const batchSize = 50;
    const results = [];

    for (let i = 0; i < to.length; i += batchSize) {
      const batch = to.slice(i, i + batchSize);
      
      // Send individual emails for better deliverability
      const batchPromises = batch.map(async (email) => {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "Conecta Funerarias <noreply@conectafunerarias.cl>",
              to: [email],
              subject: subject,
              html: html,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to send email");
          }

          const data = await res.json();
          return { email, success: true, id: data.id };
        } catch (error: any) {
          console.error(`Error sending to ${email}:`, error);
          return { email, success: false, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches
      if (i + batchSize < to.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    console.log(`Emails sent: ${successCount} success, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        failed: failCount,
        results: results,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-marketing-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
