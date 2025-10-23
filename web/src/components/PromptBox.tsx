"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { ArrowUpIcon, Upload, X } from "lucide-react";

interface PromptBoxI {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  placeholder: string;
  onSubmit?: (data: { text: string; files: File[] }) => void;
}

const PromptBox = ({ onChange, placeholder, value, onSubmit }: PromptBoxI) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isTextEntered = value ? value.trim().length > 0 : false;
  const hasFiles = files.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isTextEntered || hasFiles) handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!onSubmit) return;
    onSubmit({ text: value || "", files });
    setFiles([]); // reset files
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="z-2 w-2xl rounded-xl p-4 border border-border overflow-hidden 
        bg-card text-card-foreground ring-primary/50 ring-offset-2 
        focus-within:ring-2 transform transition-all duration-500 ease-in-out"
    >
      {/* Uploaded file preview section */}
      {files.length > 0 && (
        <div className="flex gap-3 mb-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/30">
          {files.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const isPDF = file.type === "application/pdf";
            const isVideo = file.type.startsWith("video/");
            return (
                <div className="p-1 border-1 border-border bg-card text-card-foreground flex items-center rounded-xl gap-2">
                    <div
                        key={index}
                        className="relative flex-shrink-0 w-15 h-12 rounded-lg border border-border bg-muted overflow-hidden shadow-sm"
                    >
                        {isImage ? (
                        <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                        />
                        ) : isVideo ? (
                        <video
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                            muted
                        />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary text-sm text-muted-foreground text-center p-2">
                            {isPDF ? "PDF Document" : file.name}
                        </div>
                        )}
                    </div>
                    <div className="truncate max-w-32 text-secondary-foreground">
                        {file.name}
                    </div>
                    <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="bg-black bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition mx-2"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            );
          })}
        </div>
      )}

      {/* Text input */}
      <textarea
        rows={5}
        className="w-full flex items-center border-none outline-none resize-none bg-transparent text-sm"
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        value={value}
      />

      {/* Action Buttons */}
      <div className="flex w-full justify-between items-center mt-2">
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,application/pdf"
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary text-primary-foreground cursor-pointer shadow-sm"
          type="button"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload
        </Button>

        <Button
          variant="outline"
          size="icon"
          type="submit"
          disabled={!isTextEntered && !hasFiles}
          onClick={handleSubmit}
          className="!bg-secondary !text-secondary-foreground transition-all duration-500 cursor-pointer"
        >
          <ArrowUpIcon />
        </Button>
      </div>
    </div>
  );
};

export default PromptBox;
