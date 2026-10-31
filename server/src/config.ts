import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Look for .env in current working dir, parent dir, or workspace root
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(process.cwd(), '.env.example'),
  path.resolve(process.cwd(), '../.env.example')
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    textModel: process.env.GROQ_TEXT_MODEL || 'openai/gpt-oss-120b',
    visionModel: process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b',
    timeoutMs: 90000,
  },
  upload: {
    maxFileSize: 15 * 1024 * 1024, // 15MB
    maxFiles: 5,
    tempDir: path.resolve(process.cwd(), 'temp_uploads')
  }
};
