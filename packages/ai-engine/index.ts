export interface AiRequestOptions {
  prompt: string;
  systemPrompt?: string;
  userApiKey?: string;
  preferredProvider?: 'groq' | 'gemini';
}

export interface AiResponse {
  provider: string;
  content: string;
  isByok: boolean;
  tokensEstimated: number;
}

export async function executeAiQuery(options: AiRequestOptions): Promise<AiResponse> {
  const { prompt, systemPrompt = "You are GittiG AI, an expert software architect.", userApiKey, preferredProvider = 'groq' } = options;

  // ১. যদি ইউজার নিজস্ব API Key দেয় (BYOK)
  if (userApiKey) {
    return {
      provider: preferredProvider,
      content: `[GittiG AI via BYOK (${preferredProvider})]: Generated code and architecture for -> "${prompt}"`,
      isByok: true,
      tokensEstimated: Math.ceil(prompt.length / 4)
    };
  }

  // ২. প্ল্যাটফর্মের নিজস্ব ফ্রি গেটওয়ে (Fallback সহ)
  try {
    // প্রাথমিক প্রোভাইডার সিমুলেশন (বা Groq/Gemini Free Tier API কল)
    return {
      provider: preferredProvider,
      content: `[GittiG Platform AI (${preferredProvider})]: Automated solution and test code for -> "${prompt}"`,
      isByok: false,
      tokensEstimated: Math.ceil(prompt.length / 4)
    };
  } catch (error) {
    // ফলব্যাক বিকল্প প্রোভাইডারে সুইচ
    const fallback = preferredProvider === 'groq' ? 'gemini' : 'groq';
    return {
      provider: fallback,
      content: `[GittiG AI Fallback (${fallback})]: Primary failed, recovered solution for -> "${prompt}"`,
      isByok: false,
      tokensEstimated: Math.ceil(prompt.length / 4)
    };
  }
}
