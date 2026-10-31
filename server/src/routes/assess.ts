import { Router, Request, Response, NextFunction } from 'express';
import { uploadMiddleware } from '../middleware/upload.js';
import { processUploadedFile, cleanupFiles } from '../services/documentParser.js';
import { groqService } from '../services/groq.js';
import { TaskType } from '../types/index.js';

const router = Router();

router.post(
  '/',
  uploadMiddleware.array('files', 5),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const uploadedFiles = (req.files as Express.Multer.File[]) || [];
    const filePathsToClean: string[] = uploadedFiles.map((f) => f.path).filter(Boolean);

    try {
      const taskType = (req.body.taskType as TaskType) || 'task1';
      let questionText = (req.body.questionText || '').trim();
      const essayText = (req.body.essayText || '').trim();

      if (!['task1', 'task2'].includes(taskType)) {
        res.status(400).json({ error: 'Invalid taskType. Must be "task1" or "task2".' });
        return;
      }

      if (!essayText) {
        res.status(400).json({ error: 'Essay text is required and cannot be empty.' });
        return;
      }

      const imageUrls: string[] = [];

      // Process uploaded files (images or PDFs)
      for (const file of uploadedFiles) {
        const fileData = file.buffer || file.path;
        const processed = await processUploadedFile(fileData, file.originalname, file.mimetype);
        if (processed.text) {
          questionText += (questionText ? '\n\n' : '') + `[Extracted from ${file.originalname}]:\n${processed.text}`;
        }
        for (const img of processed.images) {
          imageUrls.push(img.dataUrl);
        }
      }

      // Check header overrides
      const apiKeyOverride = (req.headers['x-groq-api-key'] as string) || undefined;
      let textModelOverride = (req.headers['x-groq-text-model'] as string) || undefined;
      if (textModelOverride && (textModelOverride.includes('llama') || textModelOverride.includes('mixtral'))) {
        textModelOverride = 'openai/gpt-oss-120b';
      }
      const visionModelOverride = (req.headers['x-groq-vision-model'] as string) || undefined;

      const assessmentResult = await groqService.assessWriting({
        taskType,
        questionText,
        essayText,
        imageUrls,
        apiKeyOverride,
        textModelOverride,
        visionModelOverride
      });

      res.json(assessmentResult);
    } catch (err) {
      next(err);
    } finally {
      // Immediately clean up temporary files from disk
      if (filePathsToClean.length > 0) {
        await cleanupFiles(filePathsToClean);
      }
    }
  }
);

export default router;
