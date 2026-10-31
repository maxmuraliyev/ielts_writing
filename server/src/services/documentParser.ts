import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import pdfParse from 'pdf-parse';

export interface ProcessedDocument {
  text: string;
  images: {
    mimeType: string;
    base64Data: string;
    dataUrl: string;
  }[];
  pageCount?: number;
  originalName: string;
}

/**
 * Validates whether the mime type or extension is supported.
 */
export function isSupportedFileType(mimetype: string, filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  const supportedExts = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const supportedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  return supportedExts.includes(ext) || supportedMimes.includes(mimetype);
}

/**
 * Optimizes an image for AI vision models (Groq) using sharp:
 * - Resizes if max dimension > 1800px to maintain crisp clarity without token explosion
 * - Standardizes to JPEG with 85% quality or PNG
 * - Returns base64 representation
 */
export async function processImageBuffer(
  buffer: Buffer,
  mimetype: string
): Promise<{ mimeType: string; base64Data: string; dataUrl: string }> {
  let image = sharp(buffer);
  const metadata = await image.metadata();

  // Resize if overly large
  const maxDim = 1800;
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  if (width > maxDim || height > maxDim) {
    image = image.resize({
      width: width > height ? maxDim : undefined,
      height: height >= width ? maxDim : undefined,
      fit: 'inside',
      withoutEnlargement: true
    });
  }


  // Convert to JPEG for optimal transfer size unless it has an alpha channel
  const isTransparent = metadata.hasAlpha;
  let outputBuffer: Buffer;
  let finalMime: string;

  if (isTransparent) {
    outputBuffer = await image.png().toBuffer();
    finalMime = 'image/png';
  } else {
    outputBuffer = await image.jpeg({ quality: 85 }).toBuffer();
    finalMime = 'image/jpeg';
  }

  const base64Data = outputBuffer.toString('base64');
  const dataUrl = `data:${finalMime};base64,${base64Data}`;

  return {
    mimeType: finalMime,
    base64Data,
    dataUrl
  };
}

/**
 * Processes an uploaded file (Image or PDF) from Buffer or file path
 */
export async function processUploadedFile(
  fileOrBuffer: string | Buffer,
  originalName: string,
  mimetype: string
): Promise<ProcessedDocument> {
  const fileBuffer = Buffer.isBuffer(fileOrBuffer) ? fileOrBuffer : await fs.readFile(fileOrBuffer);
  const ext = path.extname(originalName).toLowerCase();

  if (ext === '.pdf' || mimetype === 'application/pdf') {
    const pdfData = await pdfParse(fileBuffer);
    return {
      text: pdfData.text.trim(),
      images: [],
      pageCount: pdfData.numpages,
      originalName
    };
  }

  // It's an image
  const processedImg = await processImageBuffer(fileBuffer, mimetype);
  return {
    text: '',
    images: [processedImg],
    pageCount: 1,
    originalName
  };
}

/**
 * Safely removes temporary files from disk
 */
export async function cleanupFiles(filePaths: string[]): Promise<void> {
  for (const fp of filePaths) {
    if (!fp) continue;
    try {
      await fs.unlink(fp);
    } catch {
      // Ignore if file doesn't exist
    }
  }
}
