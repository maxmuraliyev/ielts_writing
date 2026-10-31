import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface FileUploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  acceptLabel?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  files,
  onFilesChange,
  maxFiles = 5,
  acceptLabel = 'Supports JPG, PNG, WEBP, or PDF'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

  const validateAndAddFiles = (incoming: FileList | File[]) => {
    setErrorMsg(null);
    const newFiles: File[] = [...files];

    for (let i = 0; i < incoming.length; i++) {
      const file = incoming[i];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
        setErrorMsg(`"${file.name}" is not supported. Please upload JPG, PNG, WEBP, or PDF documents.`);
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg(`"${file.name}" exceeds the 15MB file limit.`);
        return;
      }

      if (newFiles.length >= maxFiles) {
        setErrorMsg(`Maximum ${maxFiles} files allowed.`);
        break;
      }

      newFiles.push(file);
    }

    onFilesChange(newFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    // Reset input so same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf,application/pdf,image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Click to upload or drag & drop visual material
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {acceptLabel} (up to 15MB each, max {maxFiles} files)
          </p>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center space-x-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg border border-red-200 dark:border-red-900">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Uploaded File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          {files.map((file, idx) => {
            const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
            const previewUrl = !isPdf ? URL.createObjectURL(file) : null;

            return (
              <div
                key={`${file.name}-${idx}`}
                className="group relative flex items-center p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-2xs space-x-3 overflow-hidden"
              >
                <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onLoad={() => URL.revokeObjectURL(previewUrl)}
                    />
                  ) : (
                    <FileText className="w-6 h-6 text-indigo-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {isPdf ? 'PDF' : 'Image'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="absolute right-2 top-2 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
