// Separate app.listen from app.js for unit and integration testing (server doesn't need to listen on a port)
import app from './app';
import config from './config/environment';

app.shy = app.listen(config.port, () => {
  console.log(`Express Server (${app.get('env')}) - Open your browser to ${config.domain}`);
});
