import { type NextRequest, NextResponse } from "next/server"
import { checkAndDecrementCredits } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { cid: string } }) {
  try {
    const clinicId = params.cid

    const creditCheck = await checkAndDecrementCredits(clinicId, "chatbot_installs", 1)

    if (!creditCheck.allowed) {
      return NextResponse.json(
        {
          error: "Insufficient chatbot install credits",
          remaining: creditCheck.remaining,
        },
        { status: 402 },
      )
    }

    const embedScript = `
<script>
  window.OrasyncChatbot = {
    clinicId: '${clinicId}',
    apiUrl: 'https://api.orasync.com',
    init: function() {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://chat.orasync.com?clinic=' + this.clinicId;
      iframe.style.position = 'fixed';
      iframe.style.bottom = '20px';
      iframe.style.right = '20px';
      iframe.style.width = '400px';
      iframe.style.height = '600px';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      document.body.appendChild(iframe);
    }
  };
  window.OrasyncChatbot.init();
</script>
    `

    return NextResponse.json({
      success: true,
      embed_script: embedScript,
      remaining_credits: creditCheck.remaining,
    })
  } catch (error) {
    console.error("Chatbot install error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
