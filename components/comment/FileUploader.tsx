"use client";
import { useState, useRef } from "react";
import { Upload, File, FileImage, FileCode, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface FileUploaderProps {
  onFileUpload: (fileInfo: { 
    name: string; 
    url: string; 
    path: string; 
    type: string;
  }) => void;
  onCancel: () => void;
}

export function FileUploader({ onFileUpload, onCancel }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/x-python',
    'application/json',
    'text/markdown',
    'application/zip',
    'application/x-rar-compressed'
  ];

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImage className="w-5 h-5" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (type.includes('text') || type.includes('code')) return <FileCode className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not supported');
      return;
    }

    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please sign in to upload files');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comments/upload-attachment/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onFileUpload({
          name: selectedFile.name,
          url: data.url,
          path: data.path,
          type: data.type
        });
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        toast.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Attach File
        </span>
      </div>

      {!selectedFile ? (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept={allowedTypes.join(',')}
          />
          <div className="mb-3">
            <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drag & drop files here or click to browse
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
            Supported: Images, PDF, Text, Docs, Code files (Max 5MB)
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-800 rounded-lg">
                {getFileIcon(selectedFile.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({formatFileSize(selectedFile.size)})
                  </span>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Ready to upload
                </span>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {previewUrl && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-w-full max-h-48 rounded-lg mx-auto"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={removeFile}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-xs"
        >
          Close
        </Button>
      </div>
    </div>
  );
}