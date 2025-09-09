import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json();
    
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // For now, we'll format the prompt and return it for processing by the existing AI generation system
    // This endpoint serves as a bridge between the prompt input and the AI generation
    
    const enhancedPrompt = `Create a complete, modern React web application based on this request:

USER REQUEST: ${prompt}

${style ? `STYLE REQUIREMENTS: Apply ${style} styling throughout the application.` : ''}

TECHNICAL REQUIREMENTS:
1. Create a COMPLETE React application with App.jsx as the main component
2. App.jsx MUST import and render all other components
3. Use modern React patterns and hooks
4. Make it fully responsive with mobile-first design
5. Use Tailwind CSS for ALL styling (no custom CSS files)
6. Include smooth animations and transitions
7. Create proper component structure with separate files
8. Use semantic HTML5 elements
9. Ensure excellent accessibility
10. Make it production-ready with proper error handling

STYLE GUIDELINES:
${style ? getStyleGuidelines(style) : 'Use clean, modern design principles with good contrast and typography'}

IMPORTANT CONSTRAINTS:
- DO NOT use React Router or any routing libraries
- Use regular <a> tags with href="#section" for navigation if needed
- This is a single-page application
- ALWAYS create src/App.jsx that imports ALL components
- Each component should be in src/components/
- Make sure the app actually renders visible content
- Create ALL components that you reference in imports

Focus on creating a complete, functional, and visually appealing application that meets the user's requirements.`;

    return NextResponse.json({
      success: true,
      enhancedPrompt,
      originalPrompt: prompt,
      style
    });

  } catch (error: any) {
    console.error('[create-from-prompt] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getStyleGuidelines(style: string): string {
  const styleMap: { [key: string]: string } = {
    'neobrutalist': `
- Use bold, high-contrast colors (bright yellows, blues, reds)
- Apply thick black borders (border-4, border-8)
- Use stark shadows and no rounded corners
- Employ chunky, geometric shapes
- Use bold, sans-serif fonts
- Create layouts with deliberate imperfection
- Apply bright background colors`,
    
    'glassmorphism': `
- Use translucent backgrounds with backdrop-blur
- Apply subtle borders and shadows
- Use light, airy color palettes
- Create depth with layered glass effects
- Use soft gradients and subtle animations
- Maintain high contrast for readability
- Apply frosted glass aesthetics`,
    
    'minimalist': `
- Use plenty of white space
- Apply neutral color palette (grays, whites, soft colors)
- Use clean, simple typography
- Create uncluttered layouts
- Apply subtle shadows and borders
- Focus on content hierarchy
- Use minimal decorative elements`,
    
    'dark mode': `
- Use dark backgrounds (#0a0a0a, #1a1a1a)
- Apply light text colors (#ffffff, #f0f0f0)
- Use accent colors that pop on dark backgrounds
- Create proper contrast ratios
- Apply subtle borders and dividers
- Use dark-themed components
- Ensure excellent readability`,
    
    'gradient': `
- Use vibrant gradient backgrounds
- Apply colorful gradient overlays
- Create smooth color transitions
- Use rainbow or sunset color schemes
- Apply gradient text effects
- Create depth with gradient shadows
- Use multiple gradient layers`,
    
    'retro': `
- Use vintage color palettes (oranges, browns, yellows)
- Apply retro typography (serif, script fonts)
- Create 80s/90s aesthetic elements
- Use pixelated or chunky design elements
- Apply vintage filters and effects
- Create nostalgic layouts
- Use retro-inspired animations`,
    
    'modern': `
- Use contemporary design trends
- Apply clean, professional layouts
- Use modern color schemes
- Create sophisticated typography
- Apply subtle animations and micro-interactions
- Use current design patterns
- Focus on user experience`,
    
    'monochrome': `
- Use only black, white, and gray colors
- Create high contrast designs
- Apply strong typography hierarchy
- Use geometric shapes and patterns
- Create dramatic shadows and lighting
- Focus on texture and contrast
- Use minimal color accents if any`
  };

  return styleMap[style.toLowerCase()] || 'Use clean, modern design principles with good contrast and typography';
}