
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FileIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const FileUpload = ({ file, onFileChange, acceptedFileTypes = ['.pdf'] }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file) => {
    // Check if file type is allowed
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isAccepted = acceptedFileTypes.some(type => 
      type.toLowerCase().includes(fileExtension) || 
      type === '.' + fileExtension
    );

    if (!isAccepted) {
      alert(`Invalid file type. Please upload one of the following types: ${acceptedFileTypes.join(', ')}`);
      return;
    }

    onFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept={acceptedFileTypes.join(',')}
      />
      
      {!file ? (
        <div
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer",
            "transition-all duration-200 ease-in-out",
            isDragOver 
              ? "border-primary/70 bg-primary/5" 
              : "border-muted-foreground/25 hover:border-primary/40"
          )}
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center font-medium">
            Drag & drop your file here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF files only (Max 10MB)
          </p>
        </div>
      ) : (
        <div className="p-4 border rounded-md bg-secondary">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileIcon className="h-8 w-8 text-primary" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={removeFile} 
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
