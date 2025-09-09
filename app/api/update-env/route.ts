import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const allowedKeys = [
      'E2B_API_KEY',
      'FIRECRAWL_API_KEY',
      'ANTHROPIC_API_KEY',
      'OPENAI_API_KEY',
      'GEMINI_API_KEY',
      'GROQ_API_KEY',
      'OPENROUTER_API_KEY'
    ];

    // Filter out empty values and validate keys
    const validEntries = Object.entries(body)
      .filter(([key, value]) => allowedKeys.includes(key) && typeof value === 'string' && value.trim() !== '');

    if (validEntries.length === 0) {
      return NextResponse.json({ error: 'No valid environment variables provided' }, { status: 400 });
    }

    // Create .env content
    const envPath = path.join(process.cwd(), '.env');
    let existingEnv = '';
    
    // Read existing .env file if it exists
    try {
      existingEnv = fs.readFileSync(envPath, 'utf8');
    } catch (error) {
      // File doesn't exist, that's okay
    }

    // Parse existing env vars
    const existingVars: Record<string, string> = {};
    existingEnv.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        existingVars[key.trim()] = valueParts.join('=').trim();
      }
    });

    // Update with new values
    validEntries.forEach(([key, value]) => {
      existingVars[key] = value as string;
    });

    // Generate new .env content
    const newEnvContent = Object.entries(existingVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Write to .env file
    fs.writeFileSync(envPath, newEnvContent);

    return NextResponse.json({ 
      success: true, 
      message: 'Environment variables updated successfully',
      updatedKeys: validEntries.map(([key]) => key)
    });

  } catch (error) {
    console.error('Error updating environment variables:', error);
    return NextResponse.json({ 
      error: 'Failed to update environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    error: 'Method not allowed. Use POST to update environment variables.' 
  }, { status: 405 });
}