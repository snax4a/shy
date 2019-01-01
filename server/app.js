import express from 'express';
import config from './config/environment';
import expressConfigLoad from './config/express';
import routesLoad from './routes';

// Setup server
let app = express();

// Load configuration then routes
expressConfigLoad(app);
routesLoad(app);

app.shy = app.listen(config.port, () => {
  console.log(`Express Server (${app.get('env')}) - Open your browser to ${config.domain}`);
});

// Expose app
export default app;
