import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[API Error]:', err.message || err);

  // File size exceeded
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({
      error: 'File size limit exceeded. Please upload files under 15MB.'
    });
    return;
  }

  // Multer unexpected field
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    res.status(400).json({
      error: 'Too many files uploaded or unexpected field name.'
    });
    return;
  }

  const status = err.status || (err.message && err.message.includes('API key') ? 401 : 400);
  res.status(status).json({
    error: err.message || 'An unexpected error occurred while assessing the essay.'
  });
}
