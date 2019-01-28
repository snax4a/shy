import express from 'express';
import expressConfigLoad from './config/express';
import routesLoad from './routes';

// Setup server
let app = express();

// Load configuration then routes
expressConfigLoad(app);
routesLoad(app);

// Expose app
export default app;
