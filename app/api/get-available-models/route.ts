import { NextRequest, NextResponse } from 'next/server';

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description?: string;
  contextLength?: number;
  pricing?: {
    input?: number;
    output?: number;
  };
}

// Fetch models from OpenRouter
async function fetchOpenRouterModels(): Promise<ModelInfo[]> {
  if (!process.env.OPENROUTER_API_KEY) {
    return [];
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch OpenRouter models:', response.statusText);
      return [];
    }

    const data = await response.json();
    
    return data.data?.map((model: any) => ({
      id: `openrouter/${model.id}`,
      name: model.name || model.id,
      provider: 'OpenRouter',
      description: model.description,
      contextLength: model.context_length,
      pricing: {
        input: model.pricing?.prompt ? parseFloat(model.pricing.prompt) : undefined,
        output: model.pricing?.completion ? parseFloat(model.pricing.completion) : undefined,
      }
    })) || [];
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    return [];
  }
}

// Get OpenAI models (static list since OpenAI doesn't provide a public models API)
function getOpenAIModels(): ModelInfo[] {
  if (!process.env.OPENAI_API_KEY) {
    return [];
  }

  return [
    {
      id: 'openai/gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      description: 'Most advanced GPT-4 model with improved reasoning',
      contextLength: 128000,
    },
    {
      id: 'openai/gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'OpenAI',
      description: 'Faster and more affordable GPT-4 model',
      contextLength: 128000,
    },
    {
      id: 'openai/gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      description: 'High-performance GPT-4 model',
      contextLength: 128000,
    },
    {
      id: 'openai/gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      description: 'Fast and efficient model for most tasks',
      contextLength: 16385,
    },
  ];
}

// Get Anthropic models (static list)
function getAnthropicModels(): ModelInfo[] {
  if (!process.env.ANTHROPIC_API_KEY) {
    return [];
  }

  return [
    {
      id: 'anthropic/claude-3-5-sonnet-20241022',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      description: 'Most intelligent Claude model',
      contextLength: 200000,
    },
    {
      id: 'anthropic/claude-3-5-haiku-20241022',
      name: 'Claude 3.5 Haiku',
      provider: 'Anthropic',
      description: 'Fastest Claude model',
      contextLength: 200000,
    },
    {
      id: 'anthropic/claude-3-opus-20240229',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      description: 'Most powerful Claude model for complex tasks',
      contextLength: 200000,
    },
  ];
}

// Get Google models (static list)
function getGoogleModels(): ModelInfo[] {
  if (!process.env.GEMINI_API_KEY) {
    return [];
  }

  return [
    {
      id: 'google/gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      provider: 'Google',
      description: 'Advanced reasoning and long context',
      contextLength: 2000000,
    },
    {
      id: 'google/gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      provider: 'Google',
      description: 'Fast and efficient model',
      contextLength: 1000000,
    },
  ];
}

// Get Groq models (static list)
function getGroqModels(): ModelInfo[] {
  if (!process.env.GROQ_API_KEY) {
    return [];
  }

  return [
    {
      id: 'groq/llama-3.1-70b-versatile',
      name: 'Llama 3.1 70B',
      provider: 'Groq',
      description: 'High-performance open source model',
      contextLength: 131072,
    },
    {
      id: 'groq/llama-3.1-8b-instant',
      name: 'Llama 3.1 8B',
      provider: 'Groq',
      description: 'Fast open source model',
      contextLength: 131072,
    },
    {
      id: 'groq/mixtral-8x7b-32768',
      name: 'Mixtral 8x7B',
      provider: 'Groq',
      description: 'Mixture of experts model',
      contextLength: 32768,
    },
  ];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const provider = searchParams.get('provider')?.toLowerCase();

    // Fetch models from all available providers
    const [openRouterModels, openAIModels, anthropicModels, googleModels, groqModels] = await Promise.all([
      fetchOpenRouterModels(),
      getOpenAIModels(),
      getAnthropicModels(),
      getGoogleModels(),
      getGroqModels(),
    ]);

    // Combine all models
    let allModels: ModelInfo[] = [
      ...openAIModels,
      ...anthropicModels,
      ...googleModels,
      ...groqModels,
      ...openRouterModels,
    ];

    // Filter by provider if specified
    if (provider) {
      allModels = allModels.filter(model => 
        model.provider.toLowerCase().includes(provider)
      );
    }

    // Filter by search term if provided
    if (search) {
      allModels = allModels.filter(model =>
        model.name.toLowerCase().includes(search) ||
        model.id.toLowerCase().includes(search) ||
        model.description?.toLowerCase().includes(search) ||
        model.provider.toLowerCase().includes(search)
      );
    }

    // Sort models by provider and name
    allModels.sort((a, b) => {
      if (a.provider !== b.provider) {
        return a.provider.localeCompare(b.provider);
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      success: true,
      models: allModels,
      total: allModels.length,
    });

  } catch (error) {
    console.error('Error fetching available models:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch available models',
        models: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}