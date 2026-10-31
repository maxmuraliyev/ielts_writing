import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import assessRouter from './routes/assess.js';
import modelsRouter from './routes/models.js';
import healthRouter from './routes/health.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// Trust reverse proxy (essential for Vercel, rate limiter, and accurate client IP)
app.set('trust proxy', 1);
// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
// Apply rate limiter when running locally outside Vercel serverless
if (!process.env.VERCEL) {
    app.use('/api', apiRateLimiter);
}
// API Routes - mount under both /api and root for maximum proxy compatibility
app.use('/api/health', healthRouter);
app.use('/health', healthRouter);
app.use('/api/models', modelsRouter);
app.use('/models', modelsRouter);
app.use('/api/assess', assessRouter);
app.use('/assess', assessRouter);
// In local production monolithic mode, serve frontend client build if present
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get('*', (_req, res, next) => {
        if (_req.path.startsWith('/api') ||
            _req.path.startsWith('/health') ||
            _req.path.startsWith('/models') ||
            _req.path.startsWith('/assess')) {
            next();
            return;
        }
        res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
            if (err) {
                res.status(404).send('IELTS Writing Examiner API is running.');
            }
        });
    });
}
// Centralized error handler
app.use(errorHandler);
// Global unhandled error handlers for serverless diagnostics
process.on('unhandledRejection', (reason) => {
    console.error('[Process Unhandled Rejection]:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('[Process Uncaught Exception]:', err);
});
// NEVER call app.listen inside a Vercel serverless environment
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
    app.listen(config.port, () => {
        console.log(`[IELTS Examiner Server] Running on http://localhost:${config.port}`);
        console.log(`[Configuration] Text Model: ${config.groq.textModel} | Vision Model: ${config.groq.visionModel}`);
        console.log(`[API Key Status] ${config.groq.apiKey ? 'Configured from Environment' : 'Not configured in environment (pass via header/dialog)'}`);
    });
}
export default app;
