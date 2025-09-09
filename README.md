# openWebDev

[![Build Status](https://img.shields.io/github/actions/workflow/status/mendableai/openWebDev/ci.yml?branch=main)](https://github.com/mendableai/openWebDev/actions)
[![Version](https://img.shields.io/github/package-json/v/mendableai/openWebDev)](https://github.com/mendableai/openWebDev/releases)
[![License](https://img.shields.io/github/license/mendableai/openWebDev)](LICENSE)

<p align="center">
  <img src="public/proof.png" alt="openWebDev Demo" width="100%">
</p>

## 🌟 Project Overview

**openWebDev** is a revolutionary AI-powered web development platform that transforms how developers create React applications. Whether you want to replicate an existing website or build a new application from scratch, openWebDev provides an intuitive interface powered by cutting-edge AI models.

With openWebDev, you can:
- 🔄 **Replicate any website** by simply providing its URL
- ✨ **Create custom applications** from natural language descriptions
- 🎨 **Apply design styles** like Neobrutalism, Glassmorphism, and more
- 🚀 **Preview in real-time** with sandboxed execution environments
- 💾 **Download production-ready** Vite projects

The platform combines advanced AI code generation with secure sandboxed execution environments, providing real-time preview capabilities and instant deployment options.

## 🚀 Key Features

openWebDev provides a comprehensive set of features designed to accelerate web development:

### 🎯 AI-Powered Creation
* **Website Replication**: Clone existing websites by simply providing a URL with intelligent scraping and recreation
* **Prompt-Based Creation**: Generate complete React applications from text prompts with support for 8 design styles:
  - Neobrutalist: Bold colors, thick borders, chunky geometric shapes
  - Glassmorphism: Translucent backgrounds with frosted glass effects
  - Minimalist: Clean design with ample whitespace and simple typography
  - Dark Mode: Sophisticated dark-themed interfaces
  - Gradient: Vibrant gradient backgrounds and overlays
  - Retro: 80s/90s aesthetic with vintage color palettes
 - Modern: Contemporary design trends and clean layouts
  - Monochrome: Black, white, and gray color schemes with high contrast

### ⚡ Development Environment
* **Sandboxed Execution**: Secure isolated environments for testing and previewing generated code using E2B's code interpreter technology
* **Real-Time Preview**: Instantly see changes to your application with live preview capabilities
* **Streaming Code Generation**: Watch your application being generated in real-time with live code display
* **Vite Development Server**: Fast, modern development environment for React applications in the sandbox

### 🧠 AI Integration
* **Multi-AI Model Support**: Choose from various AI providers including OpenAI, Anthropic, Google, and Groq for optimal results
* **Context-Aware Development**: Maintains conversation history and project context for intelligent code modifications
* **Edit-In-Place Functionality**: Modify existing components and features with precise surgical edits using natural language

### 🛠 Development Tools
* **Package Auto-Detection**: Automatically identifies and installs required npm packages based on generated code imports
* **Theme Support**: Switch between light and dark themes with a single click
* **Downloadable Applications**: Export your generated applications as complete Vite projects ready for deployment
* **File Management System**: Intelligent file parsing and component analysis for context-aware editing

## 🏗 Architecture Overview

openWebDev follows a modern, scalable architecture designed for performance and extensibility:

```
┌─────────────────────────────────────────────┐
│                      Frontend (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│  UI Components  │  State Management  │  Theme Provider      │
├─────────────────────────────────────────────────────────────┤
│                    API Routes (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│  AI Integration  │  Sandbox Manager │  File Operations     │
├─────────────────────────────────────────────────────────────┤
│                    E2B Sandbox System                       │
├─────────────────────────────────────────────────────────────┤
│  Vite Server │  React Runtime  │  Tailwind CSS Processing  │
└─────────────────────────────────────────────┘
```

* **Frontend**: Built with Next.js 15 and Tailwind CSS, providing a responsive and interactive user interface with dark mode support
* **Backend API Routes**: RESTful API endpoints handling AI interactions, sandbox management, and file operations
* **E2B Sandbox System**: Isolated execution environments for secure code testing and preview using E2B's code interpreter technology
* **AI Integration**: Multi-provider support through Vercel AI SDK, enabling access to various state-of-the-art models
* **File Management System**: Intelligent file parsing and component analysis for context-aware editing
* **Vite Development Server**: Fast, modern development environment for React applications in the sandbox
* **Real-time Code Streaming**: Live code generation display with component-by-component progress tracking

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or pnpm package manager
- Git for version control

### Setup

1. **Clone & Install**
```bash
git clone https://github.com/mendableai/openWebDev.git
cd openWebDev
npm install
```

2. **Add `.env.local`**
```env
# Required
E2B_API_KEY=your_e2b_api_key  # Get from https://e2b.dev (Sandboxes)
FIRECRAWL_API_KEY=your_firecrawl_api_key # Get from https://firecrawl.dev (Web scraping)

# Optional (need at least one AI provider)
ANTHROPIC_API_KEY=your_anthropic_api_key  # Get from https://console.anthropic.com
OPENAI_API_KEY=your_openai_api_key  # Get from https://platform.openai.com
GEMINI_API_KEY=your_gemini_api_key  # Get from https://aistudio.google.com/app/apikey
GROQ_API_KEY=your_groq_api_key  # Get from https://console.groq.com
MOONSHOT_API_KEY=your_moonshot_api_key  # Get from https://platform.moonshot.cn
OPENROUTER_API_KEY=your_openrouter_api_key  # Get from https://openrouter.ai
```

3. **Run**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Usage Workflow

#### Option 1: Website Replication
1. Enter a website URL in the home screen
2. Choose a design style (optional)
3. Add additional context or requirements
4. Click "Clone Website" to start the process

#### Option 2: Prompt-Based Creation
1. Select "Create from Prompt" in the home screen
2. Describe your application in natural language
3. Choose a design style
4. Add additional context or requirements
5. Click "Create Website" to start the process

#### Development Process
1. **Preview Your App**: View your generated application in real-time using the integrated sandbox preview
2. **Modify and Iterate**: Use natural language to make changes, add features, or fix issues with the edit-in-place functionality
3. **Download and Deploy**: Export your complete application as a Vite project for local development or deployment

## 🎨 User Interface

### Home Screen
The intuitive home screen provides two main options:
- **Replicate Website**: Enter any URL to clone an existing website
- **Create from Prompt**: Describe your application in natural language

Both options support design style selection and additional context input.

### Development Interface
The main development interface is divided into three panels:
1. **AI Chat Panel** (Left): Interact with the AI assistant and view conversation history
2. **Preview/Code Panel** (Center): Toggle between live preview and code generation view
3. **Control Panel** (Top): Access sandbox controls, model selection, and theme toggle

### Real-time Code Generation
Watch your application being built in real-time with:
- Live code streaming display
- Component-by-component progress tracking
- File structure visualization
- Syntax-highlighted code preview

## 🔧 Advanced Features

### Multi-AI Model Support
Choose from a variety of AI models for different tasks:
- **Kimi K2 Instruct** (Default): Optimized for code generation
- **GPT-5**: Advanced reasoning and creativity
- **Sonnet 4**: Balanced performance and quality
- **Gemini 2.5 Pro**: Google's latest model
- **Mistral Nemo**: Fast and efficient
- **Llama 3.1 70B**: Open-source powerhouse
- **GLM-4.5-Air**: Free option with good performance

### Package Management
Automatic package detection and installation:
- Scans generated code for import statements
- Automatically installs required npm packages
- Handles dependency conflicts gracefully
- Provides real-time installation feedback

### Theme Customization
- **Light/Dark Mode**: One-click theme switching
- **Design Styles**: 8 predefined design aesthetics
- **Custom Styling**: Add your own CSS classes and Tailwind utilities

## 📚 Documentation

Comprehensive documentation is available to help you get the most out of openWebDev:

* [Installation Guide](docs/INSTALLATION.md) - Detailed setup instructions and system requirements
* [Usage Documentation](docs/USAGE.md) - Comprehensive guide to using all features effectively
* [FAQ](docs/FAQ.md) - Answers to common questions and troubleshooting tips
* [Troubleshooting Guide](TROUBLESHOOTING.md) - Solutions to common issues and error messages
* [Package Detection Guide](docs/PACKAGE_DETECTION_GUIDE.md) - Information on how automatic package detection works

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

* **Reporting Issues**: Check existing issues first, then create a new issue with a clear description and steps to reproduce
* **Submitting Pull Requests**: Fork the repository, create a feature branch, implement your changes, and submit a PR
* **Development Setup**: Follow the setup instructions in the contributing guide for local development

## 🛠 Troubleshooting

If you encounter issues with openWebDev, check our [Troubleshooting Guide](TROUBLESHOOTING.md) for solutions to common problems:

* **Sandbox Creation Failures**: Verify E2B API key and network connectivity
* **Package Installation Problems**: Check npm configuration and package.json dependencies
* **AI Model Connection Issues**: Confirm API keys for selected AI providers are valid and have sufficient credits

For additional help, please open an issue on GitHub with detailed information about your problem.

## 📄 License

MIT

---

<p align="center">
  Built with ❤️ by Xenonesis
</p>
