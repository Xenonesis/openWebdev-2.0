# Installation Guide

This guide provides detailed instructions for installing and setting up openWebDev on your local machine.

## Prerequisites

Before installing openWebDev, ensure you have the following software installed:

- Node.js (version 18 or higher)
- pnpm (package manager)
- Git (for version control)

### Installing Node.js

We recommend using the latest LTS version of Node.js. You can download it from [nodejs.org](https://nodejs.org/) or use a version manager like `nvm`:

```bash
# Using nvm (Node Version Manager)
nvm install --lts
nvm use --lts
```

### Installing pnpm

If you don't have pnpm installed, you can install it globally using npm:

```bash
npm install -g pnpm
```

## Installation Steps

### 1. Clone the Repository

First, clone the openWebDev repository to your local machine:

```bash
git clone https://github.com/your-username/openWebDev.git
cd openWebDev
```

### 2. Install Dependencies

Install all project dependencies using pnpm:

```bash
pnpm install
```

This command will install all required dependencies listed in the `package.json` file.

### 3. Environment Setup

Create a `.env.local` file in the root directory of the project. You can use the `.env.example` file as a template:

```bash
cp .env.example .env.local
```

Then, edit the `.env.local` file to add your specific configuration values.

### 4. Development Server

To start the development server, run:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000` by default.

### 5. Production Build

To create a production build of the application, run:

```bash
pnpm build
```

After the build is complete, you can start the production server with:

```bash
pnpm start
```

## System Requirements

### Minimum Requirements

- RAM: 4GB
- Disk Space: 1GB free space
- Processor: 1GHz or faster processor

### Recommended Requirements

- RAM: 8GB or more
- Disk Space: 2GB free space
- Processor: Multi-core processor

## Troubleshooting

If you encounter any issues during installation, please refer to our [Troubleshooting Guide](../TROUBLESHOOTING.md) for common solutions.

## Additional Resources

- [Usage Guide](./USAGE.md)
- [FAQ](./FAQ.md)
- [Contributing Guide](../CONTRIBUTING.md)