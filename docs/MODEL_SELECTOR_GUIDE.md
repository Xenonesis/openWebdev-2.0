# Dynamic Model Selector Guide

## Overview

The application now features a dynamic model selector that fetches real models from configured AI providers instead of using a hardcoded list. This provides users with access to the latest available models and their detailed information.

## Features

### 🔍 **Searchable Interface**
- Type to search through hundreds of available models
- Search by model name, provider, or description
- Real-time filtering as you type

### 📊 **Detailed Model Information**
- Model names and descriptions
- Provider information (OpenAI, Anthropic, Google, etc.)
- Context length (token limits)
- Pricing information (input/output costs)
- Free tier availability

### 🏷️ **Organized by Provider**
Models are grouped by provider for easy browsing:
- **OpenAI**: GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo, etc.
- **Anthropic**: Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus
- **Google**: Gemini 1.5 Pro, Gemini 1.5 Flash
- **Groq**: Llama 3.1 models, Mixtral
- **OpenRouter**: 300+ additional models from various providers

## How to Use

### 1. **Model Selection**
- Click on the model selector dropdown
- Use the search bar to find specific models
- Browse by provider categories
- Click on any model to select it

### 2. **Search Examples**
- Search "gpt" to find all GPT models
- Search "free" to find free tier models
- Search "claude" for Anthropic models
- Search "70b" for large parameter models

### 3. **Model Information**
Each model displays:
- **Name**: Human-readable model name
- **Provider**: The company/service providing the model
- **Description**: Capabilities and use cases
- **Context**: Maximum token limit (e.g., "128K tokens")
- **Pricing**: Cost per 1K tokens (if available)

## API Configuration

### Required Environment Variables

The system automatically detects which providers you have configured:

```bash
# At least one provider is required
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_google_key
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
```

### Model Fetching

- Models are fetched in real-time from provider APIs
- OpenRouter provides the largest selection (300+ models)
- Static lists are used for providers without public model APIs
- Failed API calls gracefully fall back to empty lists

## Technical Details

### API Endpoint
```
GET /api/get-available-models
```

### Query Parameters
- `search`: Filter models by search term
- `provider`: Filter by specific provider

### Response Format
```json
{
  "success": true,
  "models": [
    {
      "id": "openai/gpt-4o",
      "name": "GPT-4o",
      "provider": "OpenAI",
      "description": "Most advanced GPT-4 model",
      "contextLength": 128000,
      "pricing": {
        "input": 0.005,
        "output": 0.015
      }
    }
  ],
  "total": 338
}
```

## Benefits

### ✅ **Always Up-to-Date**
- No need to manually update model lists
- Automatically includes new models as they're released
- Real-time availability based on your API keys

### ✅ **Better User Experience**
- Search and filter capabilities
- Detailed model information for informed decisions
- Visual grouping by provider

### ✅ **Flexible Configuration**
- Works with any combination of providers
- Gracefully handles missing API keys
- Fallback to static lists when needed

## Troubleshooting

### No Models Showing
1. Check that at least one AI provider API key is configured
2. Verify API keys are valid and have proper permissions
3. Check browser console for API errors

### Search Not Working
1. Clear the search field and try again
2. Check for typos in search terms
3. Try broader search terms (e.g., "gpt" instead of "gpt-4o")

### Slow Loading
1. OpenRouter API calls may take a few seconds
2. Models are cached after first load
3. Consider using fewer providers if performance is critical

## Migration from Static Models

The old hardcoded model list in `config/app.config.ts` is still used as a fallback, but the new dynamic system provides much more flexibility and up-to-date information.

Users will automatically see the new interface without any configuration changes needed.