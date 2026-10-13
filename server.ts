import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Nginx in AI Studio Cloud Run listens on port 8080 and proxies traffic to localhost:3000.
// Application must listen on port 3000 to avoid EADDRINUSE on 8080.
const PORT = 3000;

// Health check endpoint for Cloud Run
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Serve static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback for client-side routing
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
