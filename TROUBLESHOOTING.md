# Troubleshooting Guide

This document provides solutions to common issues you might encounter when using or developing openWebDev.

## Installation Issues

### Dependency Installation Failures

If you encounter errors during dependency installation:

1. Clear your package manager cache:
   ```bash
   pnpm clear cache
   ```
   
2. Delete node_modules and lock files:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   ```
   
3. Reinstall dependencies:
   ```bash
   pnpm install
   ```

### Node.js Version Compatibility

Ensure you're using a compatible Node.js version. We recommend using the latest LTS version. You can check your version with:

```bash
node --version
```

If needed, use a version manager like `nvm` to switch versions:

```bash
nvm install --lts
nvm use --lts
```

## Development Issues

### Application Not Starting

If the development server fails to start:

1. Check for port conflicts:
   ```bash
   lsof -i :300
   ```
   
2. Kill any processes using the port:
   ```bash
   kill -9 <PID>
   ```

3. Restart the development server:
   ```bash
   pnpm dev
   ```

### API Routes Not Working

If API routes are not responding correctly:

1. Check the terminal for error messages
2. Verify the route file structure in `app/api/`
3. Ensure all required environment variables are set
4. Check the browser's developer console for network errors

### Sandbox Environment Issues

If the sandbox environment is not working:

1. Verify Docker is installed and running (if applicable)
2. Check that the sandbox service is properly configured
3. Review the sandbox logs for error messages
4. Ensure sufficient system resources are available

## Build Issues

### Production Build Failures

If the production build fails:

1. Check for TypeScript errors:
   ```bash
   pnpm build
   ```
   
2. Fix any reported type errors

3. Check for unused or missing dependencies

4. Verify all environment variables are properly set for production

### Performance Issues

If the application is running slowly:

1. Check for memory leaks in components
2. Optimize images and assets
3. Implement code splitting where appropriate
4. Review API call efficiency
5. Use React.memo() for components that render frequently

## Deployment Issues

### Environment Variables Not Loading

If environment variables are not being loaded:

1. Verify variables are prefixed with `NEXT_PUBLIC_` for client-side access
2. Check that `.env.local` file is in the root directory
3. Restart the development server after adding new variables

### Static Assets Not Loading

If static assets are not loading:

1. Ensure assets are placed in the `public/` directory
2. Verify asset paths are correct (they should be relative to the `public/` directory)
3. Check file permissions on the server

## Common Error Solutions

### "Module not found" Errors

1. Verify the module is installed:
   ```bash
   pnpm list <module-name>
   ```
   
2. If missing, install it:
   ```bash
   pnpm add <module-name>
   ```

### "Port already in use" Errors

1. Find the process using the port:
   ```bash
   lsof -i :3000
   ```
   
2. Kill the process:
   ```bash
   kill -9 <PID>
   ```

### "Out of Memory" Errors

1. Increase Node.js memory limit:
   ```bash
   NODE_OPTIONS=--max-old-space-size=4096 pnpm dev
   ```

2. Optimize your code to use less memory

## Getting Help

If you're still experiencing issues after trying these solutions:

1. Check the [GitHub Issues](https://github.com/your-repo/issues) to see if others have had similar problems
2. Create a new issue with detailed information about your problem
3. Include error messages, steps to reproduce, and your environment information