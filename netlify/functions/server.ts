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
    // Register routes
    await registerRoutes(app);
    routesRegistered = true;
  }
  
  return serverless(app, {
    binary: ['image/*', 'application/pdf']
  });
}

export const handler = async (event: any, context: any) => {
  if (!handler) {
    handler = await createHandler();
  }
  return handler(event, context);
};
