import { Router, Request, Response } from 'express';
import { config } from '../config.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    application: 'Personal IELTS Writing Examiner',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    config: {
      hasEnvApiKey: Boolean(config.groq.apiKey),
      textModel: config.groq.textModel,
      visionModel: config.groq.visionModel,
      nodeEnv: config.nodeEnv
    }
  });
});

export default router;
