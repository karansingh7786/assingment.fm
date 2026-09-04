import 'dotenv/config';
import app from './app.js';

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Assignment FM API server running on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});
