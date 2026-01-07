import serverless from 'serverless-http';
import { app } from '../../server/app.js';
import { registerRoutes } from '../../server/routes.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler: any;
let routesRegistered = false;

async function createHandler() {
  if (!routesRegistered) {
    // Register routes - we pass a dummy server since we don't need it for serverless
    const dummyServer = createServer(app);
    await registerRoutes(app);
    routesRegistered = true;
  }
  
  // Serve static files (for non-API routes)
  const distPath = path.resolve(__dirname, '../../dist/public');
  
  // Add static file serving for non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    express.static(distPath)(req, res, next);
  });
  
  // SPA fallback - only for non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
  
  return serverless(app);
}

export const handler = async (event: any, context: any) => {
  if (!handler) {
    handler = await createHandler();
  }
  return handler(event, context);
};
