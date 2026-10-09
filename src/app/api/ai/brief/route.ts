import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  const isConfigured = Boolean(process.env.LLAMA_API_KEY || process.env.OPENROUTER_API_KEY);
  return NextResponse.json({
    status: 'ok',
    live_ai_configured: isConfigured,
    model: 'meta-llama/Llama-3.3-70B-Instruct',
  });
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate access to paid server-side provider call
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required for server-side AI generation.' },
        { status: 401 }
      );
    }

    // 2. Validate input
    const body = await request.json().catch(() => ({}));
    const idea = (body?.idea || '').toString().trim();
    if (!idea) {
      return NextResponse.json(
        { error: 'Campaign idea prompt is required.' },
        { status: 400 }
      );
    }

    if (idea.length > 5000) {
      return NextResponse.json(
        { error: 'Prompt exceeds maximum character length (5000).' },
        { status: 400 }
      );
    }

    // 3. Read credential strictly from server-only environment variables
    const apiKey = process.env.LLAMA_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        unconfigured: true,
        message: 'Live AI provider key is not configured on the server. Falling back to deterministic demo engine.',
      });
    }

    const apiUrl = process.env.LLAMA_API_URL || 'https://openrouter.ai/api/v1/chat/completions';

    // 4. Secure external provider call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://creatorproof.ai',
        'X-Title': 'CreatorProof AI Brief Builder',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70B-Instruct',
        messages: [
          {
            role: 'system',
            content:
              'You are CreatorProof AI Brief Builder. Output a valid JSON campaign brief with fields: title, campaignObjectives, targetAudience, creativeConcept, suggestedTools (array), and deliverables (array). Never invent unconfirmed budgets.',
          },
          {
            role: 'user',
            content: idea,
          },
        ],
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!apiResponse.ok) {
      return NextResponse.json({
        success: false,
        message: `Upstream AI service returned status ${apiResponse.status}`,
      });
    }

    const data = await apiResponse.json();
    const messageContent = data?.choices?.[0]?.message?.content;
    const parsedData = messageContent ? JSON.parse(messageContent) : null;

    return NextResponse.json({
      success: true,
      live: true,
      data: parsedData,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err?.name === 'AbortError' ? 'AI request timed out' : 'Unable to complete AI generation',
    });
  }
}
